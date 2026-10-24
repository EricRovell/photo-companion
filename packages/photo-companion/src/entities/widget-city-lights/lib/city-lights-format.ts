import { isSameDay } from "utils/date";

import type { LightsNightEvent } from "lights-schedule";
import type { LightsEventName } from "types";

import type { CityLightsEventData } from "../types";

interface EventFormatOptions {
	formatDay: (date: number) => string;
	formatTime: (date: number) => string;
	label: string;
	unavailable: string;
}

export function getCityLightsDayOffset(date: Date, reference: Date): number {
	// Compare local calendar dates rather than elapsed hours across daylight saving changes.
	const calendarDay = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

	return calendarDay(date) - calendarDay(reference);
}

export function formatCityLightsDuration(duration: number): string {
	const minutes = Math.round(duration / 60_000);

	return [ Math.floor(minutes / 60), minutes % 60 ].map(value => String(value).padStart(2, "0")).join(":");
}

export function formatCityLightsCountdown(milliseconds: number): string {
	const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);

	return [ Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60 ]
		.map(value => String(value).padStart(2, "0")).join(":");
}

export function formatCityLightsEvent(event: LightsNightEvent | undefined, name: LightsEventName, options: EventFormatOptions): CityLightsEventData {
	let range: null | string = null;

	if (event?.uncertaintyMinutes) {
		const start = event.windowStart;
		const end = event.windowEnd;
		const describe = (time: number) => `${options.formatTime(time)}${isSameDay(start, end) ? "" : ` (${options.formatDay(time)})`}`;
		range = `${describe(start)} – ${describe(end)}`;
	}

	return {
		day: event ? options.formatDay(event.timestamp) : options.unavailable,
		label: options.label,
		name,
		range,
		time: event ? options.formatTime(event.timestamp) : "—"
	};
}
