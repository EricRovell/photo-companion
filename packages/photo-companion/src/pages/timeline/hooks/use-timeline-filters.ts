import { createMemo } from "solid-js";
import { isNullable } from "utils/validators";

import type { EventName } from "types";

import { useSettings } from "~/services/settings";

/**
 * Returns a Set of user blocked timeline events.
 */
export function useTimelineFilters() {
	const { settings } = useSettings();

	const getEventBlockSet = createMemo(() => {
		const eventBlockSet = new Set<EventName>();

		const eventGroups = [
			settings.events_bridges_spb,
			settings.events_lights,
			settings.events_moon,
			settings.events_sun
		];

		for (const events of eventGroups) {
			if (isNullable(events)) {
				continue;
			}

			for (const event of events) {
				eventBlockSet.add(event);
			}
		}

		return eventBlockSet;
	});

	return getEventBlockSet;
}
