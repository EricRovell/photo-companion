import { describe, expect, it } from "vitest";

import { formatRiseSetDuration } from "../rise-set-event-format";

describe("formatRiseSetDuration", () => {
	it.each([
		[ "2026-10-21T06:00:00Z", "2026-10-21T17:32:00Z", "11h 32m" ],
		[ "2026-10-21T20:00:00Z", "2026-10-22T08:00:00Z", "12h" ],
		[ "2026-10-21T06:00:00Z", "2026-10-22T18:32:00Z", "36h 32m" ],
		[ "2026-10-25T01:00:00+02:00", "2026-10-25T03:00:00+01:00", "3h" ],
		[ "2026-10-21T06:00:00Z", "2026-10-21T06:03:40Z", "4m" ]
	])("formats the actual elapsed interval from %s to %s", (rise, set, expected) => {
		expect(formatRiseSetDuration(new Date(rise), new Date(set))).toBe(expected);
	});

	it("localizes the duration units", () => {
		expect(formatRiseSetDuration(new Date("2026-10-21T06:00:00Z"), new Date("2026-10-21T17:32:00Z"), "ru"))
			.toBe("11 ч 32 мин");
	});

	it.each([
		[ null, null ],
		[ null, new Date("2026-10-21T18:00:00Z") ],
		[ new Date("2026-10-21T06:00:00Z"), null ],
		[ new Date("invalid"), new Date("2026-10-21T18:00:00Z") ],
		[ new Date("2026-10-21T18:00:00Z"), new Date("2026-10-21T06:00:00Z") ],
		[ new Date("2026-10-21T06:00:00Z"), new Date("2026-10-21T06:00:00Z") ]
	])("omits duration for incomplete or invalid intervals: %s, %s", (rise, set) => {
		expect(formatRiseSetDuration(rise, set)).toBe("");
	});
});
