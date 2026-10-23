import { describe, expect, it } from "vitest";

import { findMoonRiseSetIntervals, findSunRiseSetIntervals, getMoonEvents, getSunEvents } from "../src";
import { searchRiseSetIntervals } from "../src/rise-set/search";

import type { RiseSetSearchInput } from "../src";
import type { RiseSetCrossing, RiseSetInterval } from "../src/rise-set/types";

const DAY = 86_400_000;
const start = Date.parse("2026-10-20T00:00:00Z");
const at = (hour: number) => new Date(start + hour * 3_600_000);
const observer = { latitude: 51.5, longitude: -0.1 };

const bodies = [
	{ find: findSunRiseSetIntervals, getEvents: getSunEvents, name: "Sun", rise: "SUNRISE_START", set: "SUNSET_END" },
	{ find: findMoonRiseSetIntervals, getEvents: getMoonEvents, name: "Moon", rise: "MOONRISE", set: "MOONSET" }
];

describe.each(bodies)("$name rise/set interval search", ({ find, getEvents, name, rise, set }) => {
	it("pairs the actual events across a search longer than 48 hours", () => {
		const interval = { end: start + 3 * DAY, start };
		const result = find({ interval, observer });
		const events = [ 0, 1, 2 ].flatMap(day => getEvents({
			interval: { end: start + (day + 1) * DAY, start: start + day * DAY },
			observer
		}));
		expect(result.flatMap(interval => interval.rise ? [ interval.rise ] : []))
			.toEqual(events.filter(event => event.name === rise).map(event => event.time));
		expect(result.flatMap(interval => interval.set ? [ interval.set ] : []))
			.toEqual(events.filter(event => event.name === set).map(event => event.time));
		for (const interval of result) {
			if (interval.rise && interval.set) {
				expect(interval.set.getTime()).toBeGreaterThan(interval.rise.getTime());
			}
		}
	});

	it("preserves an isolated rise or set and returns no cycles without crossings", () => {
		const cycles = find({ interval: { end: start + 3 * DAY, start }, observer });
		const complete = cycles.find((interval): interval is { rise: Date; set: Date } => !!interval.rise && !!interval.set);
		expect(complete).toBeDefined();
		if (!complete) {
			return;
		}
		const input = (time: Date): RiseSetSearchInput => ({
			interval: { end: time.getTime() + 60_000, start: time.getTime() - 60_000 },
			observer
		});
		const riseOnly = find(input(complete.rise));
		expect(riseOnly).toHaveLength(1);
		expect(riseOnly[0].set).toBeNull();
		expect(Math.abs((riseOnly[0].rise?.getTime() ?? NaN) - complete.rise.getTime())).toBeLessThan(100);
		const setOnly = find(input(complete.set));
		expect(setOnly).toHaveLength(1);
		expect(setOnly[0].rise).toBeNull();
		expect(Math.abs((setOnly[0].set?.getTime() ?? NaN) - complete.set.getTime())).toBeLessThan(100);
		expect(find({ interval: { end: complete.rise.getTime() + 120_000, start: complete.rise.getTime() + 60_000 }, observer }))
			.toEqual([]);
	});

	it("returns no invented crossings in polar intervals without rise or set events", () => {
		// Lunar polar crossings depend on declination, not the solar season.
		for (const month of name === "Sun" ? [ "06", "12" ] : [ "06" ]) {
			expect(find({
				interval: { end: Date.parse(`2026-${month}-24T00:00:00Z`), start: Date.parse(`2026-${month}-22T00:00:00Z`) },
				observer: { latitude: 90, longitude: 0 }
			})).toEqual([]);
		}
	});

	it("validates bounds, observer and event options", () => {
		const input = { interval: { end: start + 3 * DAY, start }, observer };
		for (const interval of [
			{ end: start, start },
			{ end: start - 1, start },
			{ end: start, start: new Date(NaN) },
			{ end: new Date("2201-01-01"), start }
		]) {
			expect(() => find({ ...input, interval })).toThrow(RangeError);
		}
		expect(() => find({ ...input, observer: { latitude: 91, longitude: 0 } })).toThrow(RangeError);
		expect(() => find({ ...input, options: { step: 0 } })).toThrow(RangeError);
	});
});

describe("searchRiseSetIntervals", () => {
	it("pairs across chunks and keeps incomplete boundary intervals in chronological order", () => {
		const crossings: RiseSetCrossing[] = [
			{ direction: "setting", time: at(8) },
			{ direction: "rising", time: at(20) },
			{ direction: "setting", time: at(32) },
			{ direction: "rising", time: at(44) }
		];
		const result = searchRiseSetIntervals({ end: at(48), start: at(0) }, interval => crossings.filter(crossing =>
			crossing.time >= new Date(interval.start) && crossing.time < new Date(interval.end)));
		expect(result).toEqual([
			{ rise: null, set: at(8) },
			{ rise: at(20), set: at(32) },
			{ rise: at(44), set: null }
		]);
	});

	it("does not share a set between rises when an intermediate crossing is unavailable", () => {
		expect(searchRiseSetIntervals({ end: at(24), start: at(0) }, () => [
			{ direction: "rising", time: at(6) },
			{ direction: "rising", time: at(8) },
			{ direction: "setting", time: at(18) }
		])).toEqual([
			{ rise: at(6), set: null },
			{ rise: at(8), set: at(18) }
		] satisfies RiseSetInterval[]);
	});

	it("deduplicates the same crossing refined on either side of a chunk boundary", () => {
		const result = searchRiseSetIntervals({ end: at(48), start: at(0) }, interval =>
			new Date(interval.start).getTime() === start
				? [ { direction: "rising", time: new Date(at(24).getTime() - 20) } ]
				: [ { direction: "rising", time: at(24) }, { direction: "setting", time: at(36) } ]);
		expect(result).toHaveLength(1);
		expect(result[0].set).toEqual(at(36));
	});
});
