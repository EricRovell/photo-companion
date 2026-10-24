import { afterEach, describe, expect, it, vi } from "vitest";

import type { ScheduledLightsSchedule } from "types";

import { getLightsNight } from "../src";

function getSchedule(date: Date, uncertaintyMinutes = 0): ScheduledLightsSchedule {
	const start = new Date(date);
	start.setHours(18, 20, 0, 0);
	const end = new Date(date);
	end.setHours(6, date.getDate() === 25 ? 10 : 20, 0, 0);
	return {
		duration: 12 * 60 * 60_000,
		LIGHTS_END: end.getTime(),
		LIGHTS_START: start.getTime(),
		source: uncertaintyMinutes ? "SOLAR_ESTIMATE" : "SCHEDULE",
		status: "SCHEDULED",
		uncertaintyMinutes
	};
}

describe("getLightsNight", () => {
	afterEach(() => vi.unstubAllEnvs());

	it("joins this evening to the following morning's own schedule", () => {
		const night = getLightsNight(new Date(2026, 9, 24, 20, 40), getSchedule);
		expect(night.start).toEqual(new Date(2026, 9, 24, 12));
		expect(night.end).toEqual(new Date(2026, 9, 25, 12));
		expect(night.events.map(event => [ event.name, new Date(event.timestamp) ])).toEqual([
			[ "LIGHTS_START", new Date(2026, 9, 24, 18, 20) ],
			[ "LIGHTS_END", new Date(2026, 9, 25, 6, 10) ]
		]);
		expect(night.intervals).toHaveLength(1);
		expect(night.intervals[0].start.timestamp).toBe(new Date(2026, 9, 24, 18, 20).getTime());
		expect(night.intervals[0].end?.timestamp).toBe(new Date(2026, 9, 25, 6, 10).getTime());
		expect(night.duration).toBe((11 * 60 + 50) * 60_000);
	});

	it("keeps the previous evening and today's morning together after midnight", () => {
		const night = getLightsNight(new Date(2026, 9, 25, 4), getSchedule);
		expect(night.events[0].timestamp).toBe(new Date(2026, 9, 24, 18, 20).getTime());
		expect(night.events[1].timestamp).toBe(new Date(2026, 9, 25, 6, 10).getTime());
		expect(night.start).toEqual(new Date(2026, 9, 24, 12));
		expect(night.end).toEqual(new Date(2026, 9, 25, 12));
	});

	it.each([ 30, 60 ])("uses the full ±%i minute span at both estimated switches", (minutes) => {
		const night = getLightsNight(new Date(2026, 9, 24, 20), date => getSchedule(date, minutes));
		for (const event of night.events) {
			expect(event.uncertaintyMinutes).toBe(minutes);
			expect(event.windowStart).toBe(event.timestamp - minutes * 60_000);
			expect(event.windowEnd).toBe(event.timestamp + minutes * 60_000);
		}
		expect(night.intervals[0].start).toBe(night.events[0]);
		expect(night.intervals[0].end).toBe(night.events[1]);
	});

	it("keeps official boundaries exact without inventing an uncertainty window", () => {
		const night = getLightsNight(new Date(2026, 9, 24, 20), date => ({ ...getSchedule(date), uncertaintyMinutes: 30 }));
		for (const event of night.events) {
			expect(event.windowStart).toBe(event.timestamp);
			expect(event.windowEnd).toBe(event.timestamp);
			expect(event.uncertaintyMinutes).toBe(0);
		}
	});

	it("uses calendar dates across month and year boundaries", () => {
		const night = getLightsNight(new Date(2026, 11, 31, 23), getSchedule);
		expect(night.end).toEqual(new Date(2027, 0, 1, 12));
		expect(night.events[1].timestamp).toBe(new Date(2027, 0, 1, 6, 20).getTime());
	});

	it("preserves the full switching window across a noon boundary", () => {
		const night = getLightsNight(new Date(2026, 9, 24, 20), date => {
			const schedule = getSchedule(date, 60);
			const start = new Date(date);
			start.setHours(12, 10, 0, 0);
			return { ...schedule, LIGHTS_START: start.getTime() };
		});
		expect(night.events[0].windowStart).toBe(new Date(2026, 9, 24, 11, 10).getTime());
		expect(night.events[0].windowEnd).toBe(new Date(2026, 9, 24, 13, 10).getTime());
	});

	it.each([ "CONTINUOUS_DAYLIGHT", "CONTINUOUS_DARKNESS", "UNAVAILABLE" ] as const)("does not manufacture switch times for %s", (status) => {
		const night = getLightsNight(new Date(2026, 9, 24, 20), () => ({
			duration: null,
			LIGHTS_END: null,
			LIGHTS_START: null,
			source: "SOLAR_ESTIMATE",
			status,
			uncertaintyMinutes: 30
		}));
		expect(night.events).toEqual([]);
		expect(night.intervals).toEqual([]);
		expect(night.windows).toEqual([]);
		expect(night.duration).toBe(0);
	});

	it("includes an overlapping uncertainty window whose nominal switch is outside the night", () => {
		const night = getLightsNight(new Date(2026, 9, 24, 12, 5), date => {
			const schedule = getSchedule(date, 60);
			const end = new Date(date);
			end.setHours(11, 40, 0, 0);
			return { ...schedule, LIGHTS_END: end.getTime() };
		});
		const window = night.windows.find(event => event.timestamp === new Date(2026, 9, 24, 11, 40).getTime());
		expect(window?.windowStart).toBe(new Date(2026, 9, 24, 10, 40).getTime());
		expect(window?.windowEnd).toBe(new Date(2026, 9, 24, 12, 40).getTime());
		expect(night.events.some(event => event.timestamp === window?.timestamp)).toBe(false);
	});

	it("keeps an interval open when the following switch-off is unavailable", () => {
		const night = getLightsNight(new Date(2026, 9, 24, 20), date => date.getDate() === 25
			? { duration: null, LIGHTS_END: null, LIGHTS_START: null, source: "SOLAR_ESTIMATE", status: "UNAVAILABLE", uncertaintyMinutes: 30 }
			: getSchedule(date));
		expect(night.intervals).toHaveLength(1);
		expect(night.intervals[0].end).toBeNull();
		expect(night.events.map(event => event.name)).toEqual([ "LIGHTS_START" ]);
		expect(night.duration).toBe((17 * 60 + 40) * 60_000);
	});

	it.each([
		{ day: 28, hours: 23, lightsMinutes: 11 * 60, month: 2 },
		{ day: 24, hours: 25, lightsMinutes: 12 * 60 + 50, month: 9 }
	])("uses elapsed time across a $hours-hour daylight-saving night", ({ day, hours, lightsMinutes, month }) => {
		vi.stubEnv("TZ", "Europe/Berlin");
		const night = getLightsNight(new Date(2026, month, day, 20), getSchedule);
		expect(night.start.getHours()).toBe(12);
		expect(night.end.getHours()).toBe(12);
		expect(night.end.getTime() - night.start.getTime()).toBe(hours * 60 * 60_000);
		expect(night.duration).toBe(lightsMinutes * 60_000);
	});
});
