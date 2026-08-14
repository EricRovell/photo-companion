import { describe, expect, test } from "vitest";

import {
	getMoonEvents,
	getMoonIllumination,
	getMoonPosition,
	getMoonZenithAngle,
	getNextMoonPhases
} from "../src";

const LONDON = { latitude: 51.5, longitude: -0.1 };

const MOON_PHASE_CASES = [
	{
		description: "matches the 2025-01-06 USNO first-quarter fixture",
		input: { count: 8, index: 0, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "FIRST_QUARTER", time: Date.parse("2025-01-06T23:56:00Z") }
	},
	{
		description: "matches the 2025-01-13 USNO full-Moon fixture",
		input: { count: 8, index: 1, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "FULL_MOON", time: Date.parse("2025-01-13T22:27:00Z") }
	},
	{
		description: "matches the 2025-01-21 USNO third-quarter fixture",
		input: { count: 8, index: 2, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "THIRD_QUARTER", time: Date.parse("2025-01-21T20:31:00Z") }
	},
	{
		description: "matches the 2025-01-29 USNO new-Moon fixture",
		input: { count: 8, index: 3, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "NEW_MOON", time: Date.parse("2025-01-29T12:36:00Z") }
	},
	{
		description: "matches the 2025-02-05 USNO first-quarter fixture",
		input: { count: 8, index: 4, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "FIRST_QUARTER", time: Date.parse("2025-02-05T08:02:00Z") }
	},
	{
		description: "matches the 2025-02-12 USNO full-Moon fixture",
		input: { count: 8, index: 5, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "FULL_MOON", time: Date.parse("2025-02-12T13:53:00Z") }
	},
	{
		description: "matches the 2025-02-20 USNO third-quarter fixture",
		input: { count: 8, index: 6, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "THIRD_QUARTER", time: Date.parse("2025-02-20T17:32:00Z") }
	},
	{
		description: "matches the 2025-02-28 USNO new-Moon fixture",
		input: { count: 8, index: 7, instant: Date.parse("2025-01-01T00:00:00Z") },
		output: { phase: "NEW_MOON", time: Date.parse("2025-02-28T00:45:00Z") }
	}
];

const MOON_EVENT_CASES = [
	{
		description: "matches the USNO Moon-transit minute fixture",
		input: { eventName: "MOON_TRANSIT" },
		output: Date.parse("2025-01-01T13:34:00Z")
	},
	{
		description: "matches the USNO moonrise minute fixture",
		input: { eventName: "MOONRISE" },
		output: Date.parse("2025-01-01T09:47:00Z")
	},
	{
		description: "matches the USNO moonset minute fixture",
		input: { eventName: "MOONSET" },
		output: Date.parse("2025-01-01T17:30:00Z")
	}
];

const MOON_VALIDATION_CASES = [
	{
		description: "rejects a non-finite zenith-angle input",
		input: () => {
			getMoonZenithAngle(Number.NaN, 0);
		},
		output: RangeError
	},
	{
		description: "rejects a phase count below its range",
		input: () => {
			getNextMoonPhases(Date.parse("2025-01-01T00:00:00Z"), 0);
		},
		output: RangeError
	},
	{
		description: "rejects an invalid Date",
		input: () => {
			getMoonIllumination(new Date(Number.NaN));
		},
		output: RangeError
	},
	{
		description: "rejects an instant before the supported range",
		input: () => {
			getMoonIllumination(Date.parse("1799-12-31T00:00:00Z"));
		},
		output: RangeError
	}
];

const MOON_BOUNDARY_CASES = [
	{
		description: "keeps the minimum supported instant finite",
		input: Date.parse("1800-01-01T00:00:00Z"),
		output: true
	},
	{
		description: "keeps the maximum supported instant finite",
		input: Date.parse("2200-12-31T23:59:59Z"),
		output: true
	}
];

describe("Moon", () => {
	test("matches a JPL Horizons topocentric position fixture", () => {
		// JPL Horizons DE441, airless apparent coordinates, 2025-01-01 00:00 UTC.
		const position = getMoonPosition({
			instant: Date.parse("2025-01-01T00:00:00Z"),
			observer: LONDON
		});

		expect(position.azimuth).toBeCloseTo(328.757161, 1);
		expect(position.altitude).toBeCloseTo(-62.105703, 1);
	});

	test("matches Meeus chapter 47's lunar distance example", () => {
		const position = getMoonPosition({
			instant: Date.parse("1992-04-12T00:00:00Z"),
			observer: { latitude: 0, longitude: 0 }
		});

		expect(position.distance).toBeCloseTo(368_409.7, -1);
	});

	test("reports illumination and the third quarter consistently", () => {
		const illumination = getMoonIllumination(Date.parse("2013-03-05T00:00:00Z"));

		expect(illumination.fraction).toBeCloseTo(0.4912, 3);
		expect(illumination.phase).toBe("THIRD_QUARTER");
		expect(illumination.waxing).toBe(false);
	});

	test.each(MOON_PHASE_CASES)("$description", ({ input, output }) => {
		const phase = getNextMoonPhases(input.instant, input.count)[input.index];

		expect(phase.phase).toBe(output.phase);
		expect(Math.abs(phase.time.getTime() - output.time)).toBeLessThan(120_000);
	});

	test.each(MOON_EVENT_CASES)("$description", ({ input, output }) => {
		const events = getMoonEvents({
			interval: {
				end: Date.parse("2025-01-02T00:00:00Z"),
				start: Date.parse("2025-01-01T00:00:00Z")
			},
			observer: LONDON
		});
		const actual = events.find(event => event.name === input.eventName)?.time.getTime();

		expect(actual).toBeDefined();
		expect(Math.abs((actual ?? 0) - output)).toBeLessThan(60_000);
	});

	test("uses degree-only zenith-angle inputs", () => {
		expect(getMoonZenithAngle(90, -10)).toBe(100);
	});

	test.each(MOON_VALIDATION_CASES)("$description", ({ input, output }) => {
		expect(input).toThrow(output);
	});

	test.each(MOON_BOUNDARY_CASES)("$description", ({ input, output }) => {
		const position = getMoonPosition({ instant: input, observer: LONDON });
		const illumination = getMoonIllumination(input);

		expect(Object.values(position).every(Number.isFinite)).toBe(output);
		expect(Object.values(illumination).filter(value => typeof value === "number").every(Number.isFinite)).toBe(output);
	});
});
