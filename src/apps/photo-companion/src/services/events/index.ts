import { getLightsEvents } from "../lights";
import { getSunEvents } from "../sun";
import { getMoonEvents } from "../moon";
import { isValidDate } from "@lib/helpers";
import type { TimelineEvent, MoonEvent, LightsEvent, SunEvent } from "@lib/types";

interface Options {
	predicate: (event: TimelineEvent) => boolean;
	comparator: (a: TimelineEvent, b: TimelineEvent) => number;
}

export function isMoonEvent(event: TimelineEvent): event is MoonEvent {
	return event.name.startsWith("moon");
}

export function isLightsEvent(event: TimelineEvent): event is LightsEvent {
	return event.name.startsWith("lights");
}

export function isSunEvent(event: TimelineEvent): event is SunEvent {
	return !isMoonEvent && !isSunEvent;
}

export function getTimeline(date = new Date(), lat: number, lon: number, options: Partial<Options> = {}) {
	if (!isValidDate(date)) {
		return [];
	}

	const {
		comparator = (a, b) => a.timestamp - b.timestamp
	} = options;

	let events: TimelineEvent[] = [
		...getLightsEvents(date),
		...getSunEvents(date, lat, lon),
		...getMoonEvents(date, lat, lon)
	];

	if (options.predicate) {
		events = events.filter(options.predicate);
	}

	events.sort(comparator);

	return events;
}
