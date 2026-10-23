import { describe, expect, it } from "vitest";

import { getRiseSetMidnights } from "../rise-set-midnights";

const at = (day: number, hour: number) => new Date(2026, 9, day, hour);

describe("getRiseSetMidnights", () => {
	it("places midnight by elapsed time rather than at the arc midpoint", () => {
		expect(getRiseSetMidnights(at(21, 20), at(22, 8))).toEqual([
			{ date: at(22, 0), progress: 1 / 3 }
		]);
	});

	it("includes each midnight inside an interval longer than one day", () => {
		expect(getRiseSetMidnights(at(21, 20), at(23, 8))).toEqual([
			{ date: at(22, 0), progress: 1 / 9 },
			{ date: at(23, 0), progress: 7 / 9 }
		]);
	});

	it("does not duplicate a rise or set that falls exactly at midnight", () => {
		expect(getRiseSetMidnights(at(21, 0), at(22, 0))).toEqual([]);
	});

	it.each([
		[ at(21, 6), at(21, 18) ],
		[ null, at(22, 8) ],
		[ at(21, 20), null ],
		[ new Date(NaN), at(22, 8) ],
		[ at(21, 20), new Date(NaN) ],
		[ at(21, 20), at(21, 20) ],
		[ at(22, 8), at(21, 20) ]
	])("omits markers for daytime, missing or invalid intervals: %s, %s", (rise, set) => {
		expect(getRiseSetMidnights(rise, set)).toEqual([]);
	});
});
