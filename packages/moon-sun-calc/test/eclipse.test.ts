import { isNullable } from "utils/validators";
import { describe, expect, test } from "vitest";

import {
	findNextLocalSolarEclipse,
	findPreviousLocalSolarEclipse,
	getLocalSolarEclipse,
	getNearbyLocalSolarEclipse,
	getSolarEclipseState
} from "../src";

import type {
	SolarEclipseInput,
	SolarEclipsePhase,
	SolarEclipseSearchInput,
	SolarEclipseType
} from "../src";

const DALLAS = { latitude: 32.7767, longitude: -96.797 };
const ALBUQUERQUE = { latitude: 35.0844, longitude: -106.6504 };
const NEW_YORK = { latitude: 40.7128, longitude: -74.006 };

interface LocalEclipseCase {
	description: string;
	input: SolarEclipseInput;
	output: {
		obscuration: number;
		partialBegin: string;
		partialEnd: string;
		peak: string;
		sunAltitude?: number;
		type: SolarEclipseType;
	};
}

interface EclipseStateCase {
	description: string;
	input: SolarEclipseInput;
	output: {
		minimumOffsetFromCenter?: number;
		obscuration: number;
		phase: SolarEclipsePhase;
	};
}

interface DirectionalBoundaryCase {
	description: string;
	input: {
		direction: "next" | "previous";
		search: SolarEclipseSearchInput;
	};
	output: null;
}

function differenceMinutes(actual: Date, expected: string): number {
	return Math.abs(actual.getTime() - Date.parse(expected)) / 60_000;
}

describe("Solar eclipses", () => {
	test.each<LocalEclipseCase>([
		// NASA local circumstances: https://science.nasa.gov/eclipses/future-eclipses/eclipse-2024/where-when/
		{
			description: "matches the 2024 total eclipse in Dallas",
			input: {
				instant: Date.parse("2024-04-08T18:42:00Z"),
				observer: DALLAS
			},
			output: {
				obscuration: 1,
				partialBegin: "2024-04-08T17:23:00Z",
				partialEnd: "2024-04-08T20:02:00Z",
				peak: "2024-04-08T18:42:00Z",
				sunAltitude: 65,
				type: "TOTAL"
			}
		},
		// NASA/MSFC local circumstances: https://magnetograph.msfc.nasa.gov/outreach/girlscouts/G-605996_TwoEclipses_Jun15_2022.pdf
		{
			description: "classifies the 2023 annular eclipse in Albuquerque",
			input: {
				instant: Date.parse("2023-10-14T16:36:00Z"),
				observer: ALBUQUERQUE
			},
			output: {
				obscuration: 0.9,
				partialBegin: "2023-10-14T15:13:00Z",
				partialEnd: "2023-10-14T18:09:00Z",
				peak: "2023-10-14T16:37:00Z",
				type: "ANNULAR"
			}
		},
		// NASA major-city circumstances: https://eclipse.gsfc.nasa.gov/SEcirc/SEcircNA/NewYorkNY2.html
		{
			description: "classifies the 2024 eclipse as partial in New York",
			input: {
				instant: Date.parse("2024-04-08T19:25:00Z"),
				observer: NEW_YORK
			},
			output: {
				obscuration: 0.9,
				partialBegin: "2024-04-08T18:10:00Z",
				partialEnd: "2024-04-08T20:36:00Z",
				peak: "2024-04-08T19:25:00Z",
				type: "PARTIAL"
			}
		}
	])("$description", ({ input, output }) => {
		const event = getLocalSolarEclipse(input);

		expect(event).not.toBeNull();

		if (isNullable(event)) {
			throw new Error(`Expected a ${output.type.toLowerCase()} eclipse`);
		}

		expect(event.type).toBe(output.type);
		expect(Math.abs(event.obscuration - output.obscuration)).toBeLessThan(0.02);
		expect(differenceMinutes(event.partialBegin.time, output.partialBegin)).toBeLessThan(2);
		expect(differenceMinutes(event.peak.time, output.peak)).toBeLessThan(2);
		expect(differenceMinutes(event.partialEnd.time, output.partialEnd)).toBeLessThan(2);

		if (!isNullable(output.sunAltitude)) {
			expect(event.peak.sunAltitude).toBeCloseTo(output.sunAltitude, 0);
		}
	});

	test("marks an eclipse interrupted by the horizon as partially visible", () => {
		const event = getLocalSolarEclipse({
			instant: Date.parse("2021-06-10T09:45:00Z"),
			observer: NEW_YORK
		});

		expect(event).not.toBeNull();
		expect(event?.type).toBe("PARTIAL");
		expect(event?.visibility).toBe("PARTIAL");
		expect(event?.partialBegin.visible).toBe(false);
		expect(event?.partialEnd.visible).toBe(true);
	});

	test.each([
		{
			description: "includes the local eclipse shortly before C1",
			input: { instant: Date.parse("2024-04-08T17:00:00Z"), margin: 30 * 60 * 1000 },
			output: "TOTAL"
		},
		{
			description: "includes the local eclipse shortly after C4",
			input: { instant: Date.parse("2024-04-08T20:25:00Z"), margin: 30 * 60 * 1000 },
			output: "TOTAL"
		},
		{
			description: "excludes the local eclipse before the context window",
			input: { instant: Date.parse("2024-04-08T16:50:00Z"), margin: 30 * 60 * 1000 },
			output: null
		},
		{
			description: "excludes the local eclipse after the context window",
			input: { instant: Date.parse("2024-04-08T20:35:00Z"), margin: 30 * 60 * 1000 },
			output: null
		}
	])("$description", ({ input, output }) => {
		const event = getNearbyLocalSolarEclipse({
			...input,
			observer: DALLAS
		});

		expect(event?.type ?? null).toBe(output);
	});

	test("keeps the exact local eclipse lookup strict outside C1 to C4", () => {
		const event = getLocalSolarEclipse({
			instant: Date.parse("2024-04-08T17:00:00Z"),
			observer: DALLAS
		});

		expect(event).toBeNull();
	});

	test.each<EclipseStateCase>([
		{
			description: "returns the current geometry outside an eclipse",
			input: {
				instant: Date.parse("2025-01-01T12:00:00Z"),
				observer: NEW_YORK
			},
			output: { obscuration: 0, phase: "NONE" }
		},
		{
			description: "keeps the Moon outside the eclipse view near opposition",
			input: {
				instant: Date.parse("2025-01-13T22:27:00Z"),
				observer: NEW_YORK
			},
			output: { minimumOffsetFromCenter: 1, obscuration: 0, phase: "NONE" }
		}
	])("$description", ({ input, output }) => {
		const state = getSolarEclipseState(input);
		const offsetFromCenter = Math.max(
			Math.abs(state.moon.offset.azimuth),
			Math.abs(state.moon.offset.altitude)
		);

		expect(state.phase).toBe(output.phase);
		expect(state.obscuration).toBe(output.obscuration);
		expect(Number.isFinite(offsetFromCenter)).toBe(true);

		if (!isNullable(output.minimumOffsetFromCenter)) {
			expect(offsetFromCenter).toBeGreaterThan(output.minimumOffsetFromCenter);
		}
	});

	test("finds eclipses in both directions and skips the same peak", () => {
		const atPeak = Date.parse("2024-04-08T18:42:28Z");
		const previous = findPreviousLocalSolarEclipse({ instant: atPeak, observer: DALLAS, visibleOnly: true });
		const next = findNextLocalSolarEclipse({ instant: atPeak, observer: DALLAS, visibleOnly: true });

		expect(previous?.peak.time.getTime()).toBeLessThan(atPeak);
		expect(next?.peak.time.getTime()).toBeGreaterThan(atPeak);
	});

	test.each<DirectionalBoundaryCase>([
		{
			description: "returns null at the minimum supported search boundary",
			input: {
				direction: "previous",
				search: {
					instant: Date.parse("1800-01-01T00:00:00Z"),
					observer: DALLAS,
					visibleOnly: true
				}
			},
			output: null
		},
		{
			description: "returns null at the maximum supported search boundary",
			input: {
				direction: "next",
				search: {
					instant: Date.parse("2200-12-31T23:59:59Z"),
					observer: DALLAS,
					visibleOnly: true
				}
			},
			output: null
		}
	])("$description", ({ input, output }) => {
		const event = input.direction === "next"
			? findNextLocalSolarEclipse(input.search)
			: findPreviousLocalSolarEclipse(input.search);

		expect(event).toBe(output);
	});
});
