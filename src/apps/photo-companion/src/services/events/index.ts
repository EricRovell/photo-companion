import { provider as lightsProvider } from "../lights";
import { getSunEvents } from "../sun";
import { getMoonEvents } from "../moon";
import { isValidDate } from "@lib/helpers";
import type {
	EventName,
	LightsEventName,
	MoonEventName,
	SunEventName,
	TimelineEvent
} from "@shared/types";

interface Options {
	comparator: (a: TimelineEvent, b: TimelineEvent) => number;
	lightsEvents: LightsEventName[] | null;
	moonEvents: MoonEventName[] | null;
	predicate: (event: TimelineEvent) => boolean;
	sunEvents: SunEventName[] | null;
	secondaryEvents?: Set<EventName>;
}

type EventProviderByDate = [
	"DATE",
	Nullable<(date: Date) => TimelineEvent[]>,
	"lights"
];

type EventProviderByLocation = [
	"LOCATION",
	(date: Date, latitude: number, longitude: number) => TimelineEvent[],
	"sun" | "moon"
];

const EVENT_PROVIDERS: Array<EventProviderByDate | EventProviderByLocation> = [
	[ "LOCATION", getMoonEvents, "moon" ],
	[ "LOCATION", getSunEvents, "sun" ],
	[ "DATE", lightsProvider?.getEventsByDate, "lights" ]
];

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
