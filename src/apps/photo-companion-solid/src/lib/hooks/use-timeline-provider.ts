import type { TimelineEvent } from "types";
import { isLatitude, isLongitude, isValidDate } from "utils/validators";

type ProviderArgType = "DATE" | "LOCATION";

type ArgsDate = [ date: Date ];
type ArgsDateLocation = [ date: Date, latitude: number, longitude: number ];

type ArgsByType<T> = T extends "DATE"
	? ArgsDate
	: ArgsDateLocation;

type EventProviderByArgTypeAndEvent<
	ArgType extends ProviderArgType,
	Event extends TimelineEvent
> = Event extends unknown ? {
	disabled?: boolean;
	provider: (...args: ArgsByType<ArgType>) => Event[];
	type: ArgType;
} : never;

type EventProviderByInput<T extends ProviderArgType> = T extends unknown
	? EventProviderByArgTypeAndEvent<T, TimelineEvent>
	: never

type EventProvider = EventProviderByInput<ProviderArgType>;

interface Options {
	comparator?: (a: TimelineEvent, b: TimelineEvent) => number;
	predicate?: (event: TimelineEvent) => boolean;
	providers: Array<EventProvider>;
}

/**
 * By default the event order is DESC.
 */
const DEFAULT_EVENT_COMPARATOR = (a: TimelineEvent, b: TimelineEvent) => a.timestamp - b.timestamp;

export function useTimelineProvider(options: Options) {
	const {
		comparator = DEFAULT_EVENT_COMPARATOR,
		predicate = null,
		providers = []
	} = options;

	function getTimeline(date = new Date(), latitude: number, longitude: number) {
		if (!isValidDate(date) || !isLatitude(latitude) || !isLongitude(longitude)) {
			return [];
		}

		const timeline: TimelineEvent[] = [];

		for (const { disabled = false, provider, type } of providers) {
			if (disabled) {
				continue;
			}

			const events = (type === "DATE")
				? provider(date)
				: provider(date, latitude, longitude);

			for (const event of events) {
				if (predicate && !predicate(event)) {
					continue;
				}

				timeline.push(event);
			}
		}

		timeline.sort(comparator);

		return timeline;
	}

	return {
		getTimeline
	};
}
