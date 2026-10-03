import { describe, expect, test } from "vitest";

import { getSeasonEvents } from "../src";

const SEASON_CASES = [
	[ "EQUINOX_MARCH", "2025-03-20T09:01:00Z" ],
	[ "SOLSTICE_JUNE", "2025-06-21T02:42:00Z" ],
	[ "EQUINOX_SEPTEMBER", "2025-09-22T18:19:00Z" ],
	[ "SOLSTICE_DECEMBER", "2025-12-21T15:03:00Z" ]
] as const;

describe("Seasons", () => {
	test.each(SEASON_CASES)("matches the USNO 2025 %s minute fixture", (name, expected) => {
		const event = getSeasonEvents(2025).find(item => item.name === name);

		expect(event).toBeDefined();
		expect(Math.abs((event?.time.getTime() ?? 0) - Date.parse(expected))).toBeLessThan(60_000);
	});

	test("returns events in chronological order", () => {
		const timestamps = getSeasonEvents(2025).map(event => event.time.getTime());

		expect(timestamps).toEqual(timestamps.toSorted((left, right) => left - right));
	});

	test.each([ 1799, 2025.5, 2201, Number.NaN ])("rejects an invalid year: %s", (year) => {
		expect(() => getSeasonEvents(year)).toThrow(RangeError);
	});
});
