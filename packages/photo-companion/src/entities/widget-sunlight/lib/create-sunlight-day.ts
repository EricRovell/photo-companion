import { getSunEvents, getSunPosition, MAX_SUPPORTED_YEAR } from "moon-sun-calc";
import { getDayStart, shiftDate } from "utils/date";

import type { Observer, SunEventName } from "moon-sun-calc";

import type { SunlightDay, SunlightInterval, SunlightPeriod, SunlightPhase, SunlightTransition } from "../types";

/**
 * Photographic phases take priority where they overlap twilight.
 *
 * The blue-hour window spans civil dawn/dusk, so those crossings do not change the ring color.
 */
const PHASE_AFTER_EVENT: Partial<Record<SunEventName, SunlightPhase>> = {
	ASTRONOMICAL_DAWN: "astronomical",
	ASTRONOMICAL_DUSK: "night",
	BLUE_HOUR_END_DAWN: "civil",
	BLUE_HOUR_END_DUSK: "nautical",
	BLUE_HOUR_START_DAWN: "blue",
	BLUE_HOUR_START_DUSK: "blue",
	GOLDEN_HOUR_END_DAWN: "daylight",
	GOLDEN_HOUR_END_DUSK: "civil",
	GOLDEN_HOUR_START_DAWN: "golden",
	GOLDEN_HOUR_START_DUSK: "golden",
	NAUTICAL_DAWN: "nautical",
	NAUTICAL_DUSK: "astronomical"
};

export function getSunlightPhase(altitude: number): SunlightPhase {
	if (altitude >= 6) {
		return "daylight";
	}

	if (altitude >= -1) {
		return "golden";
	}

	if (altitude >= -4) {
		return "civil";
	}

	if (altitude >= -8) {
		return "blue";
	}

	if (altitude >= -12) {
		return "nautical";
	}

	return altitude >= -18 ? "astronomical" : "night";
}

export function createSunlightDay(date: Date, observer: Observer): SunlightDay {
	const start = getDayStart(date);
	const end = shiftDate(start, "day", 1).getTime();

	const events = getSunEvents({
		interval: {
			end,
			start
		},
		observer
	});

	const altitude = (instant: number) => getSunPosition({
		instant,
		observer
	}).altitude;

	const intervals: SunlightInterval[] = [];

	let phase = getSunlightPhase(altitude(start));
	let previous = start;

	for (const event of events) {
		const nextPhase = PHASE_AFTER_EVENT[event.name];

		if (!nextPhase || nextPhase === phase) {
			continue;
		}

		const timestamp = event.time.getTime();

		if (timestamp > previous) {
			intervals.push({
				end: timestamp,
				phase,
				start: previous
			});
		}

		phase = nextPhase;
		previous = timestamp;
	}

	intervals.push({
		end,
		phase,
		start: previous
	});

	// Split legend ranges at solar turning points, so morning/evening follow
	// the rising/setting Sun even when the observer differs from the time zone.
	const turningPoints = events
		.filter(event => event.name === "SOLAR_NOON" || event.name === "NADIR")
		.map(event => event.time.getTime());

	const periods: SunlightPeriod[] = intervals.flatMap(interval => {
		const boundaries = [
			interval.start,
			...turningPoints.filter(time => time > interval.start && time < interval.end), interval.end
		];

		return boundaries.slice(0, -1).map((start, index) => {
			const end = boundaries[index + 1];
			const middle = (start + end) / 2;
			return {
				end,
				period: altitude(Math.min(end - 1, middle + 1000)) >= altitude(Math.max(start, middle - 1000)) ? "morning" : "evening",
				phase: interval.phase,
				start
			};
		});
	});

	return {
		end,
		intervals,
		markers: events.flatMap(event => event.name === "SUNRISE_START" || event.name === "SUNSET_END" ? [ {
			timestamp: event.time.getTime(),
			type: event.name === "SUNRISE_START" ? "sunrise" as const : "sunset" as const
		} ] : []),
		periods,
		start
	};
}

export function getFollowingSunlightChange(day: SunlightDay, observer: Observer): null | SunlightTransition {
	const end = Math.min(
		shiftDate(day.end, "day", 1).getTime(),
		Date.UTC(MAX_SUPPORTED_YEAR + 1, 0, 1) - 1
	);

	if (end <= day.end) {
		return null;
	}

	const phase = day.intervals[day.intervals.length - 1].phase;

	const event = getSunEvents({
		interval: {
			end,
			start: day.end
		},
		observer
	}).find(event => PHASE_AFTER_EVENT[event.name] && PHASE_AFTER_EVENT[event.name] !== phase);

	const nextPhase = event && PHASE_AFTER_EVENT[event.name];

	return event && nextPhase ? {
		phase: nextPhase,
		timestamp: event.time.getTime()
	} : null;
}
