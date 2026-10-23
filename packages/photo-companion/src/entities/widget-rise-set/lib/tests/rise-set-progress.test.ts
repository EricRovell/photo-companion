import { describe, expect, it } from "vitest";

import { calculateRiseSetProgress } from "../rise-set-progress";

const at = (day: number, hour: number) => new Date(2026, 9, day, hour);

describe("calculateRiseSetProgress", () => {
	it.each([
		[ "2026-10-21T06:34:40Z", 0 ],
		[ "2026-10-21T16:54:47Z", 1 ],
		[ "2026-10-21T06:34:39Z", null ],
		[ "2026-10-21T16:54:48Z", null ]
	])("recognizes whole-second event links at %s", (date, expected) => {
		const rise = new Date("2026-10-21T06:34:40.261Z");
		const set = new Date("2026-10-21T16:54:47.585Z");
		expect(calculateRiseSetProgress(new Date(date), rise, set).position).toBe(expected);
	});

	it.each([
		[ "intervals longer than a day", at(21, 13), at(20, 20), at(22, 6) ],
		[
			"clock-offset changes",
			new Date("2026-11-01T01:00:00-05:00"),
			new Date("2026-11-01T00:30:00-04:00"),
			new Date("2026-11-01T02:30:00-05:00")
		]
	])("uses elapsed timestamps for %s", (_scenario, date, rise, set) => {
		expect(calculateRiseSetProgress(date, rise, set).position).toBe(0.5);
	});

	it.each([
		[ 6, 0 ],
		[ 12, 0.5 ],
		[ 18, 1 ]
	])("places hour %i at progress %s on the semicircle", (hour, expected) => {
		expect(calculateRiseSetProgress(at(21, hour), at(21, 6), at(21, 18)).position).toBe(expected);
	});

	it.each([ [ 5, 0 ], [ 19, 1 ] ])("clamps the arc and hides the marker outside the interval at hour %i", (hour, arc) => {
		expect(calculateRiseSetProgress(at(21, hour), at(21, 6), at(21, 18))).toEqual({ arc, position: null });
	});

	it.each([
		[ "missing rise", at(21, 12), null, at(21, 18) ],
		[ "missing set", at(21, 12), at(21, 6), null ],
		[ "zero-length interval", at(21, 12), at(21, 6), at(21, 6) ],
		[ "invalid date", new Date(NaN), at(21, 6), at(21, 18) ]
	])("hides progress for %s", (_scenario, date, rise, set) => {
		expect(calculateRiseSetProgress(date, rise, set)).toEqual({ arc: 0, position: null });
	});
});
