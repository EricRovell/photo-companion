import type { LightsSchedule } from "types";

import { MILLISECONDS_PER_MINUTE } from "./const";

import type { LightsNight, LightsNightEvent, LightsNightInterval } from "./types";

/** A local noon-to-noon night, using each calendar day's own switching times. */
export function getLightsNight(date: Date, getSchedule: (date: Date) => LightsSchedule): LightsNight {
	const start = new Date(date);
	start.setHours(12, 0, 0, 0);

	if (date < start) {
		start.setDate(start.getDate() - 1);
	}

	const end = new Date(start);
	end.setDate(end.getDate() + 1);

	const startTimestamp = start.getTime();
	const endTimestamp = end.getTime();
	const events: LightsNightEvent[] = [];

	for (const offset of [ -1, 0, 1 ]) {
		const day = new Date(start);
		day.setDate(day.getDate() + offset);

		const schedule = getSchedule(day);

		if (schedule.status !== "SCHEDULED") {
			continue;
		}

		const uncertaintyMinutes = schedule.source === "SOLAR_ESTIMATE"
			? schedule.uncertaintyMinutes
			: 0;

		for (const name of [ "LIGHTS_START", "LIGHTS_END" ] as const) {
			const timestamp = schedule[name];

			events.push({
				name,
				timestamp,
				uncertaintyMinutes,
				windowEnd: timestamp + uncertaintyMinutes * MILLISECONDS_PER_MINUTE,
				windowStart: timestamp - uncertaintyMinutes * MILLISECONDS_PER_MINUTE
			});
		}
	}

	events.sort((a, b) => a.timestamp - b.timestamp);

	const intervals: LightsNightInterval[] = [];
	let activeStart: LightsNightEvent | null = null;

	for (const event of events) {
		if (event.name === "LIGHTS_START") {
			activeStart = event;
		} else if (activeStart) {
			if (event.timestamp > startTimestamp && activeStart.timestamp < endTimestamp) {
				intervals.push({
					end: event,
					start: activeStart
				});
			}
			activeStart = null;
		}
	}

	if (activeStart && activeStart.timestamp < endTimestamp) {
		intervals.push({
			end: null,
			start: activeStart
		});
	}

	const duration = intervals.reduce((total, interval) => total
		+ Math.min(interval.end?.timestamp ?? endTimestamp, endTimestamp)
		- Math.max(interval.start.timestamp, startTimestamp), 0);

	return {
		duration,
		end,
		events: events.filter(event => event.timestamp >= startTimestamp && event.timestamp <= endTimestamp),
		intervals,
		start,
		windows: events.filter(event => event.uncertaintyMinutes > 0
			&& event.windowEnd > startTimestamp
			&& event.windowStart < endTimestamp)
	};
}
