import { useSettings } from "@lib/context";
import type { EventName } from "types";
import { isNullable } from "utils/validators";

/**
 * Returns a Set of user blocked timeline events.
 */
export function useTimelineFilters() {
	const { getSettings } = useSettings();
	const eventBlockSet = new Set<EventName>();
	const { events_bridges_spb, events_lights, events_moon, events_sun } = getSettings();

	for (const events of [ events_bridges_spb, events_lights, events_moon, events_sun]) {
		if (isNullable(events)) {
			continue;
		}

		for (const event of events) {
			eventBlockSet.add(event);
		}
	}

	return eventBlockSet;
}
