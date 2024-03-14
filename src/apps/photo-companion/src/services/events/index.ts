import type { EventName, TimelineEvent } from "@shared/types";
import { isValidDate } from "utils/validators";

import { EVENT_PROVIDERS } from "./consts";
import type { Options } from "./types";

export function initTimelineProvider(options: Partial<Options>) {
	const eventProviders: typeof EVENT_PROVIDERS = [];
	const eventFilterSet = new Set<EventName>();

	function update(updatedOptions: Partial<Options>) {
		eventProviders.length = 0;
		eventFilterSet.clear();

		for (const [ providerType, provider, group ] of EVENT_PROVIDERS) {
			const eventNames = updatedOptions[`${group}Events`];
	
			if (!eventNames || !provider) {
				continue;
			}

			// @ts-expect-error the group and providerType are in order
			eventProviders.push([ providerType, provider, group ]);

			for (const event of eventNames) {
				eventFilterSet.add(event);
			}
		}
	}

	function getEvents(date = new Date(), latidude: number, longitude: number) {
		if (!isValidDate(date)) {
			return [];
		}
	
		const {
			comparator = (a, b) => a.timestamp - b.timestamp,
			predicate
		} = options;

		const timeline: TimelineEvent[] = [];

		for (const [ providerType, provider ] of eventProviders) {
			if (!provider) {
				continue;
			}

			const events = (providerType === "DATE")
				? provider(date)
				: provider(date, latidude, longitude);

			for (const event of events) {
				if (eventFilterSet.has(event.name)) {
					continue;
				}

				if (predicate && !predicate(event)) {
					continue;
				}

				if (options.secondaryEvents?.has(event.name)) {
					event.secondary = true;
				}

				timeline.push(event);
			}
		}

		timeline.sort(comparator);

		return timeline;
	}

	update(options);

	return {
		getEvents,
		update
	};
}
