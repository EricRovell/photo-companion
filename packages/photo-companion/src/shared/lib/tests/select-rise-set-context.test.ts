import { describe, expect, it } from "vitest";

import { selectRiseSetContext } from "../rise-set";

const at = (day: number, hour: number) => new Date(Date.UTC(2026, 9, day, hour));

const intervals = [
	{
		rise: at(20, 6),
		set: at(20, 18)
	},
	{
		rise: at(21, 6),
		set: at(21, 18)
	},
	{
		rise: at(22, 7),
		set: at(22, 19)
	}
];

describe("selectRiseSetContext", () => {
	it.each([
		[ 5, at(20, 18), at(21, 6), at(21, 6) ],
		[ 6, at(20, 18), at(21, 6), at(22, 7) ],
		[ 12, at(20, 18), at(21, 6), at(22, 7) ],
		[ 18, at(21, 18), at(22, 7), at(22, 7) ],
		[ 20, at(21, 18), at(22, 7), at(22, 7) ]
	] as const)("selects the below-horizon interval and next rise at hour %i", (hour, start, end, nextRise) => {
		expect(selectRiseSetContext(at(21, hour), intervals))
			.toEqual({
				belowHorizonInterval: {
					end,
					start
				},
				nextRise
			});
	});

	it.each([ "rise", "set" ] as const)("recognizes a whole-second %s link before a fractional-second event", (event) => {
		const cycle = {
			rise: new Date("2026-10-21T06:00:00.261Z"),
			set: new Date("2026-10-21T18:00:00.585Z")
		};
		const context = selectRiseSetContext(at(21, event === "rise" ? 6 : 18), [ intervals[0], cycle, intervals[2] ]);

		expect(context).toEqual({
			belowHorizonInterval: {
				end: event === "rise" ? cycle.rise : at(22, 7),
				start: event === "rise" ? at(20, 18) : cycle.set
			},
			nextRise: at(22, 7)
		});
	});

	it("uses actual timestamps across a change in UTC offset", () => {
		const set = new Date("2026-10-24T18:00:00+02:00");
		const rise = new Date("2026-10-25T06:00:00+01:00");
		const context = selectRiseSetContext(new Date("2026-10-24T22:00:00+02:00"), [ {
			rise: null,
			set
		}, {
			rise,
			set: null
		} ]);

		expect(context).toEqual({
			belowHorizonInterval: {
				end: rise,
				start: set
			},
			nextRise: rise
		});
		expect(rise.getTime() - set.getTime()).toBe(13 * 3_600_000);
	});

	it("does not invent missing neighboring events", () => {
		expect(selectRiseSetContext(at(21, 5), [ intervals[1] ]))
			.toEqual({
				belowHorizonInterval: {
					end: at(21, 6),
					start: null
				},
				nextRise: at(21, 6)
			});
		expect(selectRiseSetContext(at(21, 20), [ intervals[1] ]))
			.toEqual({
				belowHorizonInterval: {
					end: null,
					start: at(21, 18)
				},
				nextRise: null
			});
		expect(selectRiseSetContext(at(21, 12), []))
			.toEqual({
				belowHorizonInterval: {
					end: null,
					start: null
				},
				nextRise: null
			});
	});
});
