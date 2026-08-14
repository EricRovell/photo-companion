import { describe, expect, test } from "vitest";

import {
	findSunAltitudeCrossings,
	findSunAzimuthCrossings,
	getSunEvents,
	getSunPosition
} from "../src";

const LONDON = { latitude: 51.5, longitude: -0.1 };

const NEW_YEAR_2025 = {
	end: Date.parse("2025-01-02T00:00:00Z"),
	start: Date.parse("2025-01-01T00:00:00Z")
};

const SUN_EVENT_CASES = [
	{
		description: "matches the USNO civil-dawn minute fixture",
		input: { eventName: "CIVIL_DAWN", interval: NEW_YEAR_2025, observer: LONDON },
		output: "07:26"
	},
	{
		description: "matches the USNO civil-dusk minute fixture",
		input: { eventName: "CIVIL_DUSK", interval: NEW_YEAR_2025, observer: LONDON },
		output: "16:42"
	},
	{
		description: "matches the USNO solar-noon minute fixture",
		input: { eventName: "SOLAR_NOON", interval: NEW_YEAR_2025, observer: LONDON },
		output: "12:04"
	},
	{
		description: "matches the USNO sunrise minute fixture",
		input: { eventName: "SUNRISE_START", interval: NEW_YEAR_2025, observer: LONDON },
		output: "08:06"
	},
	{
		description: "matches the USNO sunset minute fixture",
		input: { eventName: "SUNSET_END", interval: NEW_YEAR_2025, observer: LONDON },
		output: "16:02"
	}
];

const SUN_VALIDATION_CASES = [
	{
		description: "rejects an observer latitude outside its range",
		input: () => {
			getSunPosition({
				instant: Date.parse("2025-01-01T12:00:00Z"),
				observer: { latitude: 91, longitude: 0 }
			});
		},
		output: RangeError
	},
	{
		description: "rejects a reversed interval",
		input: () => {
			getSunEvents({
				interval: { end: NEW_YEAR_2025.start, start: NEW_YEAR_2025.end },
				observer: LONDON
			});
		},
		output: RangeError
	},
	{
		description: "rejects an altitude outside its range",
		input: () => {
			findSunAltitudeCrossings({
				altitude: 91,
				interval: NEW_YEAR_2025,
				observer: LONDON
			});
		},
		output: RangeError
	},
	{
		description: "rejects an azimuth outside its half-open range",
		input: () => {
			findSunAzimuthCrossings({
				azimuth: 360,
				interval: NEW_YEAR_2025,
				observer: LONDON
			});
		},
		output: RangeError
	},
	{
		description: "rejects non-positive atmospheric pressure",
		input: () => {
			getSunPosition({
				instant: Date.parse("2025-01-01T12:00:00Z"),
				observer: LONDON,
				options: { atmosphere: { pressure: 0 } }
			});
		},
		output: RangeError
	},
	{
		description: "rejects an event step below its range",
		input: () => {
			getSunEvents({
				interval: NEW_YEAR_2025,
				observer: LONDON,
				options: { step: 1 }
			});
		},
		output: RangeError
	}
];

const SUN_BOUNDARY_CASES = [
	{
		description: "keeps the minimum supported instant finite",
		input: { instant: Date.parse("1800-01-01T00:00:00Z"), observer: LONDON },
		output: true
	},
	{
		description: "keeps the maximum supported instant finite",
		input: { instant: Date.parse("2200-12-31T23:59:59Z"), observer: LONDON },
		output: true
	}
];

describe("Sun", () => {
	test("matches a JPL Horizons topocentric position fixture", () => {
		// JPL Horizons DE441, airless apparent coordinates, 2025-01-01 12:00 UTC.
		const position = getSunPosition({
			instant: Date.parse("2025-01-01T12:00:00Z"),
			observer: LONDON
		});

		expect(position.azimuth).toBeCloseTo(179.025844, 1);
		expect(position.altitude).toBeCloseTo(15.536300, 1);
		expect(position.apparentAltitude).toBeGreaterThan(position.altitude);
	});

	test.each(SUN_EVENT_CASES)("$description", ({ input, output }) => {
		const events = getSunEvents({ interval: input.interval, observer: input.observer });
		const event = events.find(item => item.name === input.eventName);

		expect(event?.time.toISOString().slice(11, 16)).toBe(output);
	});

	test("finds requested altitude crossings without mixing degrees and radians", () => {
		const crossings = findSunAltitudeCrossings({
			altitude: 6,
			interval: NEW_YEAR_2025,
			observer: LONDON
		});

		expect(crossings).toHaveLength(2);
		expect(crossings.map(crossing => crossing.direction)).toEqual([ "rising", "setting" ]);

		for (const crossing of crossings) {
			expect(getSunPosition({ instant: crossing.time, observer: LONDON }).altitude).toBeCloseTo(6, 3);
		}
	});

	test("solves azimuth across the north wrap instead of assuming monotonicity", () => {
		const sydney = { latitude: -33.8688, longitude: 151.2093 };
		const crossings = findSunAzimuthCrossings({
			azimuth: 90,
			interval: NEW_YEAR_2025,
			observer: sydney
		});

		expect(crossings.length).toBeGreaterThan(0);
		for (const crossing of crossings) {
			expect(getSunPosition({ instant: crossing.time, observer: sydney }).azimuth).toBeCloseTo(90, 3);
		}
	});

	test("returns no fabricated polar events", () => {
		const polar = getSunEvents({
			interval: NEW_YEAR_2025,
			observer: { latitude: 89, longitude: 0 }
		});

		expect(polar.some(event => event.name === "SUNRISE_START" || event.name === "SUNSET_END")).toBe(false);
	});

	test.each(SUN_VALIDATION_CASES)("$description", ({ input, output }) => {
		expect(input).toThrow(output);
	});

	test.each(SUN_BOUNDARY_CASES)("$description", ({ input, output }) => {
		const position = getSunPosition(input);

		expect(Object.values(position).every(Number.isFinite)).toBe(output);
	});
});
