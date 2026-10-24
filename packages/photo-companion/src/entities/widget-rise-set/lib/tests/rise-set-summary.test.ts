import { describe, expect, it } from "vitest";

import { getRiseSetSummary } from "../rise-set-summary";

const at = (day: number, hour: number) => new Date(Date.UTC(2026, 9, day, hour));
const cycle = {
	rise: at(21, 6),
	set: at(21, 18)
};
const fractionalCycle = {
	rise: new Date("2026-10-21T06:00:00.261Z"),
	set: new Date("2026-10-21T18:00:00.585Z")
};

describe("getRiseSetSummary", () => {
	it.each([
		{
			description: "selects the preceding below-horizon duration before rise",
			input: {
				aboveHorizon: false,
				belowHorizonInterval: {
					end: at(21, 6),
					start: at(20, 18)
				},
				date: at(21, 5),
				nextRise: at(21, 6),
				...cycle
			},
			output: {
				end: at(21, 6),
				nextEvent: at(21, 6),
				start: at(20, 18),
				untilSet: false
			}
		},
		{
			description: "counts down to the following rise at the rise instant",
			input: {
				aboveHorizon: false,
				belowHorizonInterval: {
					end: at(21, 6),
					start: at(20, 18)
				},
				date: at(21, 6),
				nextRise: at(22, 7),
				...cycle
			},
			output: {
				end: at(21, 6),
				nextEvent: at(22, 7),
				start: at(20, 18),
				untilSet: false
			}
		},
		{
			description: "selects the above-horizon duration and counts down to set",
			input: {
				aboveHorizon: true,
				belowHorizonInterval: {
					end: at(21, 6),
					start: at(20, 18)
				},
				date: at(21, 12),
				nextRise: at(22, 7),
				...cycle
			},
			output: {
				end: at(21, 18),
				nextEvent: at(21, 18),
				start: at(21, 6),
				untilSet: true
			}
		},
		{
			description: "selects the following below-horizon duration at set",
			input: {
				aboveHorizon: false,
				belowHorizonInterval: {
					end: at(22, 7),
					start: at(21, 18)
				},
				date: at(21, 18),
				nextRise: at(22, 7),
				...cycle
			},
			output: {
				end: at(22, 7),
				nextEvent: at(22, 7),
				start: at(21, 18),
				untilSet: false
			}
		},
		{
			description: "keeps counting down to the following rise after set",
			input: {
				aboveHorizon: false,
				belowHorizonInterval: {
					end: at(22, 7),
					start: at(21, 18)
				},
				date: at(21, 20),
				nextRise: at(22, 7),
				...cycle
			},
			output: {
				end: at(22, 7),
				nextEvent: at(22, 7),
				start: at(21, 18),
				untilSet: false
			}
		},
		{
			description: "recognizes a whole-second rise link before a fractional-second calculator event",
			input: {
				aboveHorizon: false,
				belowHorizonInterval: {
					end: fractionalCycle.rise,
					start: at(20, 18)
				},
				date: at(21, 6),
				nextRise: at(22, 7),
				...fractionalCycle
			},
			output: {
				end: fractionalCycle.rise,
				nextEvent: at(22, 7),
				start: at(20, 18),
				untilSet: false
			}
		},
		{
			description: "recognizes a whole-second set link before a fractional-second calculator event",
			input: {
				aboveHorizon: false,
				belowHorizonInterval: {
					end: at(22, 7),
					start: fractionalCycle.set
				},
				date: at(21, 18),
				nextRise: at(22, 7),
				...fractionalCycle
			},
			output: {
				end: at(22, 7),
				nextEvent: at(22, 7),
				start: fractionalCycle.set,
				untilSet: false
			}
		}
	])("$description", ({ input, output }) => {
		expect(getRiseSetSummary(input)).toEqual(output);
	});

	it("uses the set and next rise across a change in UTC offset", () => {
		const set = new Date("2026-10-24T18:00:00+02:00");
		const rise = new Date("2026-10-25T06:00:00+01:00");
		const summary = getRiseSetSummary({
			aboveHorizon: false,
			belowHorizonInterval: {
				end: rise,
				start: set
			},
			date: new Date("2026-10-24T22:00:00+02:00"),
			nextRise: rise,
			rise: null,
			set
		});

		expect(summary.start).toEqual(set);
		expect(summary.end).toEqual(rise);
		expect((summary.end?.getTime() ?? NaN) - (summary.start?.getTime() ?? NaN)).toBe(13 * 3_600_000);
	});

	it("leaves unknown events unavailable instead of adding a day to the previous rise", () => {
		const summary = getRiseSetSummary({
			aboveHorizon: false,
			date: at(21, 20),
			...cycle
		});

		expect(summary.nextEvent).toBeNull();
		expect(summary.end).toBeNull();
		expect(summary.start).toBeNull();
	});
});
