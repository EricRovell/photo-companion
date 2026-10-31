import { getSunEvents, getSunPosition } from "moon-sun-calc";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createSunlightDay, getFollowingSunlightChange, getSunlightDialPoint, getSunlightPhase } from ".";

const observer = {
	latitude: 51.5,
	longitude: 0
};
const date = new Date("2026-09-21T12:00:00Z");
const HOUR = 60 * 60 * 1000;

afterEach(() => vi.unstubAllEnvs());

describe("sunlight daily intervals", () => {
	it("covers the whole day without gaps and agrees with geometric solar altitude", () => {
		const day = createSunlightDay(date, observer);
		expect(day.intervals[0].start).toBe(day.start);
		expect(day.intervals[day.intervals.length - 1].end).toBe(day.end);
		expect(new Set(day.intervals.map(interval => interval.phase)).size).toBe(7);

		for (const [ index, interval ] of day.intervals.entries()) {
			expect(interval.end).toBeGreaterThan(interval.start);

			if (index > 0) {
				expect(interval.start).toBe(day.intervals[index - 1].end);
			}

			const altitude = getSunPosition({
				instant: (interval.start + interval.end) / 2,
				observer
			}).altitude;

			expect(interval.phase).toBe(getSunlightPhase(altitude));
		}
	});

	it("uses the same golden/blue hour endpoints and sunrise/sunset events as the timeline", () => {
		const day = createSunlightDay(date, observer);

		const events = getSunEvents({
			interval: {
				end: day.end,
				start: day.start
			},
			observer
		});

		const eventTime = (name: string) => events.find(event => event.name === name)?.time.getTime();
		const morningGolden = day.periods.find(interval => interval.phase === "golden" && interval.period === "morning");
		const eveningBlue = day.periods.find(interval => interval.phase === "blue" && interval.period === "evening");
		expect(morningGolden?.start).toBe(eventTime("GOLDEN_HOUR_START_DAWN"));
		expect(morningGolden?.end).toBe(eventTime("GOLDEN_HOUR_END_DAWN"));
		expect(eveningBlue?.start).toBe(eventTime("BLUE_HOUR_START_DUSK"));
		expect(eveningBlue?.end).toBe(eventTime("BLUE_HOUR_END_DUSK"));
		expect(day.markers.map(marker => marker.timestamp)).toEqual([ eventTime("SUNRISE_START"), eventTime("SUNSET_END") ]);
		expect(day.markers.map(marker => marker.type)).toEqual([ "sunrise", "sunset" ]);
		const morningAstronomical = day.periods.find(interval => interval.phase === "astronomical" && interval.period === "morning");
		const morningNautical = day.periods.find(interval => interval.phase === "nautical" && interval.period === "morning");

		const morningCivil = day.periods.find(interval => interval.phase === "civil" && interval.period === "morning");
		expect(morningAstronomical?.start).toBe(eventTime("ASTRONOMICAL_DAWN"));
		expect(morningAstronomical?.end).toBe(eventTime("NAUTICAL_DAWN"));
		expect(morningNautical?.start).toBe(eventTime("NAUTICAL_DAWN"));
		expect(morningNautical?.end).toBe(eventTime("BLUE_HOUR_START_DAWN"));
		expect(morningCivil?.start).toBe(eventTime("BLUE_HOUR_END_DAWN"));
		expect(morningCivil?.end).toBe(eventTime("GOLDEN_HOUR_START_DAWN"));
	});

	it("follows rising and setting periods when solar morning is in the local evening", () => {
		const day = createSunlightDay(date, {
			latitude: 51.5,
			longitude: 180
		});

		const morning = day.periods.find(interval => interval.phase === "golden" && interval.period === "morning");
		const evening = day.periods.find(interval => interval.phase === "golden" && interval.period === "evening");

		expect(new Date(morning?.start ?? 0).getUTCHours()).toBeGreaterThan(12);
		expect(new Date(evening?.start ?? 0).getUTCHours()).toBeLessThan(12);
	});

	it.each([
		[ "2026-06-21T12:00:00Z", "daylight" ],
		[ "2026-12-21T12:00:00Z", "night" ]
	])("keeps an entire polar day as one %s phase (%s)", (date, phase) => {
		const day = createSunlightDay(new Date(date), {
			latitude: 90,
			longitude: 0
		});

		expect(day.intervals).toEqual([ {
			end: day.end,
			phase,
			start: day.start
		} ]);

		expect(day.markers).toEqual([]);
		expect(getFollowingSunlightChange(day, {
			latitude: 90,
			longitude: 0 
		})).toBeNull();
	});

	it("omits astronomical night during Saint Petersburg's white nights", () => {
		const day = createSunlightDay(new Date("2026-06-21T12:00:00Z"), {
			latitude: 59.94,
			longitude: 30.31
		});

		expect(day.intervals.some(interval => interval.phase === "night")).toBe(false);
		expect(day.intervals.some(interval => interval.phase === "civil")).toBe(true);
	});

	it("continues the final night's countdown through midnight to the following dawn", () => {
		const day = createSunlightDay(date, observer);
		const next = createSunlightDay(new Date(day.end), observer);
		const change = getFollowingSunlightChange(day, observer);

		expect(change).toEqual({
			phase: "astronomical",
			timestamp: next.intervals[0].end
		});

		expect(change?.timestamp).toBeGreaterThan(day.end);
	});

	it.each([
		[ "2026-03-08T12:00:00-04:00", 23 ],
		[ "2026-11-01T12:00:00-05:00", 25 ]
	])("preserves the duration of the local day on %s", (date, hours) => {
		vi.stubEnv("TZ", "America/New_York");

		const day = createSunlightDay(new Date(date), {
			latitude: 40.7,
			longitude: -74
		});

		expect(day.end - day.start).toBe(hours * HOUR);
		expect(day.intervals.reduce((duration, interval) => duration + interval.end - interval.start, 0)).toBe(hours * HOUR);
	});
});

describe("sunlight dial orientation", () => {
	it("places midnight at the bottom, morning left, noon top, and evening right", () => {
		const points = [ 0, 0.25, 0.5, 0.75 ].map(progress => getSunlightDialPoint(progress, 100));
		expect(points[0].y).toBeCloseTo(260);
		expect(points[1].x).toBeCloseTo(60);
		expect(points[2].y).toBeCloseTo(60);
		expect(points[3].x).toBeCloseTo(260);
	});
});
