import type { LightsNight, LightsNightEvent } from "lights-schedule";

import type { CityLightsNight, CityLightsNightEvent } from "../types";

/** Projects schedule timestamps onto the widget's clipped percentage scale. */
export function getCityLightsNightGraph(night: LightsNight, date: Date): CityLightsNight {
	const duration = night.end.getTime() - night.start.getTime();
	const position = (timestamp: number) => Math.max(0, Math.min(100, (timestamp - night.start.getTime()) / duration * 100));

	const projectEvent = (event: LightsNightEvent): CityLightsNightEvent => ({
		name: event.name,
		position: position(event.timestamp),
		timestamp: event.timestamp,
		uncertaintyMinutes: event.uncertaintyMinutes,
		windowEnd: position(event.windowEnd),
		windowStart: position(event.windowStart)
	});

	const intervals = night.intervals.map(interval => {
		const innerStart = position(interval.start.windowEnd);

		return {
			end: position(interval.end?.timestamp ?? night.end.getTime()),
			innerEnd: Math.max(innerStart, position(interval.end?.windowStart ?? night.end.getTime())),
			innerStart,
			start: position(interval.start.timestamp)
		};
	});

	const ticks = [ 0, 6, 12, 18, 24 ].map(hours => {
		const time = new Date(night.start);
		time.setHours(time.getHours() + hours);

		return {
			position: position(time.getTime()),
			time
		};
	});

	return {
		end: night.end,
		events: night.events.map(projectEvent),
		intervals,
		position: position(date.getTime()),
		start: night.start,
		ticks,
		windows: night.windows.map(projectEvent)
	};
}
