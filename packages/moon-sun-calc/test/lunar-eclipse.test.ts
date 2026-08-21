import { isNullable } from "utils/validators";
import { describe, expect, test } from "vitest";

import {
	findNextLocalLunarEclipse,
	findPreviousLocalLunarEclipse,
	getLocalLunarEclipse,
	getLunarEclipseState,
	getNearbyLocalLunarEclipse
} from "../src";

import type {
	LocalLunarEclipse,
	LunarEclipsePhase,
	LunarEclipseType,
	Observer
} from "../src";

const DALLAS = { latitude: 32.7767, longitude: -96.797 };
const LONDON = { latitude: 51.5072, longitude: -0.1276 };
const MOSCOW = { latitude: 55.7558, longitude: 37.6173 };

interface LunarEclipseCase {
	description: string;
	input: string;
	output: {
		partialBegin?: string;
		partialEnd?: string;
		peak: string;
		penumbralBegin: string;
		penumbralEnd: string;
		penumbralMagnitude: number;
		totalBegin?: string;
		totalEnd?: string;
		type: LunarEclipseType;
		umbralMagnitude: number;
	};
}

function differenceMinutes(actual: Date, expected: string): number {
	return Math.abs(actual.getTime() - Date.parse(expected)) / 60_000;
}

function expectContact(actual: Date | undefined, expected: string | undefined): void {
	if (expected === undefined) {
		expect(actual).toBeUndefined();
		return;
	}

	expect(actual).toBeDefined();

	if (actual !== undefined) {
		expect(differenceMinutes(actual, expected)).toBeLessThan(2);
	}
}

function getEvent(instant: string, observer: Observer = DALLAS): LocalLunarEclipse {
	const event = getLocalLunarEclipse({ instant: Date.parse(instant), observer });

	if (isNullable(event)) {
		throw new Error(`Expected a lunar eclipse near ${instant}`);
	}

	return event;
}

describe("Lunar eclipses", () => {
	test.each<LunarEclipseCase>([
		{
			description: "matches the 2025 March total eclipse",
			input: "2025-03-14T06:58:43Z",
			output: {
				partialBegin: "2025-03-14T05:09:27Z",
				partialEnd: "2025-03-14T08:47:47Z",
				peak: "2025-03-14T06:58:43Z",
				penumbralBegin: "2025-03-14T03:57:09Z",
				penumbralEnd: "2025-03-14T10:00:05Z",
				penumbralMagnitude: 2.259,
				totalBegin: "2025-03-14T06:25:57Z",
				totalEnd: "2025-03-14T07:31:26Z",
				type: "TOTAL",
				umbralMagnitude: 1.178
			}
		},
		{
			description: "matches the 2024 September partial eclipse",
			input: "2024-09-18T02:44:18Z",
			output: {
				partialBegin: "2024-09-18T02:12:58Z",
				partialEnd: "2024-09-18T03:15:38Z",
				peak: "2024-09-18T02:44:18Z",
				penumbralBegin: "2024-09-18T00:41:07Z",
				penumbralEnd: "2024-09-18T04:47:27Z",
				penumbralMagnitude: 1.037,
				type: "PARTIAL",
				umbralMagnitude: 0.085
			}
		},
		{
			description: "matches the 2024 March penumbral eclipse",
			input: "2024-03-25T07:12:49Z",
			output: {
				peak: "2024-03-25T07:12:49Z",
				penumbralBegin: "2024-03-25T04:53:16Z",
				penumbralEnd: "2024-03-25T09:33:12Z",
				penumbralMagnitude: 0.956,
				type: "PENUMBRAL",
				umbralMagnitude: -0.133
			}
		}
	])("$description", ({ input, output }) => {
		const event = getEvent(input);

		expect(event.type).toBe(output.type);
		expect(Math.abs(event.penumbralMagnitude - output.penumbralMagnitude)).toBeLessThan(0.02);
		expect(Math.abs(event.umbralMagnitude - output.umbralMagnitude)).toBeLessThan(0.02);
		expect(differenceMinutes(event.penumbralBegin.time, output.penumbralBegin)).toBeLessThan(2);
		expect(differenceMinutes(event.peak.time, output.peak)).toBeLessThan(2);
		expect(differenceMinutes(event.penumbralEnd.time, output.penumbralEnd)).toBeLessThan(2);
		expectContact(event.partialBegin?.time, output.partialBegin);
		expectContact(event.totalBegin?.time, output.totalBegin);
		expectContact(event.totalEnd?.time, output.totalEnd);
		expectContact(event.partialEnd?.time, output.partialEnd);
	});

	test.each([
		{ expected: "FULL", observer: DALLAS },
		{ expected: "PARTIAL", observer: LONDON },
		{ expected: "NONE", observer: MOSCOW }
	] as const)("classifies 2025 March visibility as $expected", ({ expected, observer }) => {
		const event = getEvent("2025-03-14T06:58:43Z", observer);

		expect(event.visibility).toBe(expected);
	});

	test("classifies penumbral noticeability", () => {
		expect(getEvent("2024-03-25T07:12:49Z").noticeability).toBe("SUBTLE");
		expect(getEvent("2027-07-18T16:03:00Z").noticeability).toBe("UNLIKELY");
	});

	test.each<{ expected: LunarEclipsePhase; instant: string }>([
		{ expected: "NONE", instant: "2025-01-01T12:00:00Z" },
		{ expected: "PENUMBRAL", instant: "2025-03-14T04:30:00Z" },
		{ expected: "PARTIAL", instant: "2025-03-14T05:30:00Z" },
		{ expected: "TOTAL", instant: "2025-03-14T06:58:43Z" }
	])("returns the $expected current phase", ({ expected, instant }) => {
		const state = getLunarEclipseState({ instant: Date.parse(instant), observer: DALLAS });

		expect(state.phase).toBe(expected);
		expect(Number.isFinite(state.moon.offset.altitude)).toBe(true);
		expect(Number.isFinite(state.moon.offset.azimuth)).toBe(true);
	});

	test("supports nearby context without weakening exact lookup", () => {
		const instant = Date.parse("2025-03-13T20:00:00Z");
		const observer = DALLAS;

		expect(getLocalLunarEclipse({ instant, observer })).toBeNull();
		expect(getNearbyLocalLunarEclipse({
			instant,
			margin: 12 * 60 * 60 * 1000,
			observer
		})?.type).toBe("TOTAL");
	});

	test("finds eclipses in both directions and skips the same peak", () => {
		const atPeak = Date.parse("2025-03-14T06:58:43Z");
		const previous = findPreviousLocalLunarEclipse({ instant: atPeak, observer: DALLAS, visibleOnly: true });
		const next = findNextLocalLunarEclipse({ instant: atPeak, observer: DALLAS, visibleOnly: true });

		expect(previous?.peak.time.getTime()).toBeLessThan(atPeak);
		expect(next?.peak.time.getTime()).toBeGreaterThan(atPeak);
	});

	test("returns null at supported search boundaries", () => {
		expect(findPreviousLocalLunarEclipse({
			instant: Date.parse("1800-01-01T00:00:00Z"),
			observer: DALLAS,
			visibleOnly: true
		})).toBeNull();
		expect(findNextLocalLunarEclipse({
			instant: Date.parse("2200-12-31T23:59:59Z"),
			observer: DALLAS,
			visibleOnly: true
		})).toBeNull();
	});
});
