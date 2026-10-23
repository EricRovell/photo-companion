import { describe, expect, it } from "vitest";

import type { RiseSetInterval } from "moon-sun-calc";

import { selectRiseSetInterval } from "../rise-set";

const at = (day: number, hour: number) => new Date(2026, 9, day, hour);

const overnight: RiseSetInterval[] = [
	{ rise: at(20, 20), set: at(21, 8) },
	{ rise: at(21, 21), set: at(22, 9) }
];

describe("selectRiseSetInterval", () => {
	it("keeps the active overnight cycle on either side of midnight", () => {
		for (const date of [ at(20, 23), at(21, 2), at(21, 8) ]) {
			expect(selectRiseSetInterval(date, overnight)).toEqual(overnight[0]);
		}
	});

	it("previews today's upcoming rise between overnight cycles", () => {
		expect(selectRiseSetInterval(at(21, 12), overnight)).toEqual(overnight[1]);
	});

	it("keeps the completed cycle after a same-day set", () => {
		const completed = { rise: at(21, 6), set: at(21, 18) };
		expect(selectRiseSetInterval(at(21, 20), [ completed, { rise: at(22, 7), set: at(22, 19) } ]))
			.toEqual(completed);
	});

	it("uses the previous cycle after a day with only a set", () => {
		expect(selectRiseSetInterval(at(21, 12), [ overnight[0], { rise: at(22, 0), set: at(22, 9) } ]))
			.toEqual(overnight[0]);
	});

	it("uses the following set on a day with only a rise", () => {
		const interval = { rise: at(21, 20), set: at(22, 8) };
		expect(selectRiseSetInterval(at(21, 12), [ interval ])).toEqual(interval);
	});

	it("does not select an earlier set for an upcoming incomplete cycle", () => {
		expect(selectRiseSetInterval(at(21, 12), [
			{ rise: null, set: at(21, 8) },
			{ rise: at(21, 21), set: null }
		])).toEqual({ rise: at(21, 21), set: null });
	});

	it("retains an incomplete previous rise or following set outside the selected day", () => {
		const riseOnly = { rise: at(20, 20), set: null };
		const setOnly = { rise: null, set: at(22, 8) };
		expect(selectRiseSetInterval(at(21, 12), [ riseOnly ])).toEqual(riseOnly);
		expect(selectRiseSetInterval(at(21, 12), [ setOnly, { rise: at(22, 20), set: null } ])).toEqual(setOnly);
	});

	it("keeps the active cycle at its endpoints without mutating the input", () => {
		const intervals = Object.freeze([ ...overnight ]);
		expect(selectRiseSetInterval(at(21, 8), intervals)).toBe(overnight[0]);
		expect(selectRiseSetInterval(at(21, 21), intervals)).toBe(overnight[1]);
		expect(intervals).toEqual(overnight);
	});

	it.each([
		[ "before both rises", at(21, 5), 0 ],
		[ "between cycles", at(21, 12), 1 ],
		[ "after both sets", at(21, 23), 1 ]
	])("selects the correct same-day cycle %s", (_scenario, date, expected) => {
		const cycles = [
			{ rise: at(21, 6), set: at(21, 10) },
			{ rise: at(21, 15), set: at(21, 19) }
		];
		expect(selectRiseSetInterval(date, [ ...cycles, { rise: at(22, 6), set: at(22, 18) } ])).toBe(cycles[expected]);
	});

	it.each([
		[ 5, 7 ],
		[ 12, 18 ],
		[ 20, 7 ]
	])("selects the nearest upcoming unpaired set or the first set today at hour %i", (hour, expected) => {
		expect(selectRiseSetInterval(at(21, hour), [
			{ rise: null, set: at(21, 7) },
			{ rise: null, set: at(21, 18) }
		])).toEqual({ rise: null, set: at(21, expected) });
	});

	it("chooses the next rise when two sunrises fall on the same civil day", () => {
		const first = { rise: new Date(2026, 3, 17, 0, 7), set: new Date(2026, 3, 17, 22, 12) };
		const second = { rise: new Date(2026, 3, 17, 23, 38), set: null };
		const intervals = [ first, second ];
		expect(selectRiseSetInterval(new Date(2026, 3, 17, 0), intervals)).toEqual(first);
		expect(selectRiseSetInterval(new Date(2026, 3, 17, 12), intervals)).toEqual(first);
		expect(selectRiseSetInterval(new Date(2026, 3, 17, 23), intervals)).toEqual(second);
		expect(selectRiseSetInterval(new Date(2026, 3, 18, 12), intervals)).toEqual(second);
	});

	it("preserves missing events instead of inventing times", () => {
		expect(selectRiseSetInterval(at(21, 12), [])).toEqual({ rise: null, set: null });
		expect(selectRiseSetInterval(at(21, 12), [ { rise: null, set: at(21, 8) } ]))
			.toEqual({ rise: null, set: at(21, 8) });
		expect(selectRiseSetInterval(at(21, 12), [ { rise: at(21, 6), set: null } ]))
			.toEqual({ rise: at(21, 6), set: null });
	});
});
