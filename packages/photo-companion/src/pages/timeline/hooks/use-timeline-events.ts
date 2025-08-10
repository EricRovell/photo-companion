import { getBridgeEvents } from "bridge-schedule";
import { isNullable } from "utils/validators";

import { useTimelineProvider } from "~/entities/timeline";
import { useCityLights } from "~/features/city-lights";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { getMoonEvents, getSunEvents } from "~/features/timeline";

import { useTimelineFilters } from "./use-timeline-filters";

/*
	TODO: think about code-splitting,
	as some providers can be deactivated or not available,
	but the code is loaded nevertheless.
*/

export function useTimelineEvents() {
	const { isSupportsBridges, isSupportsCityLights, settings } = useSettings();

	const timelineFilterSet = useTimelineFilters();
	const { getEventsByDate } = useCityLights();
	const { getTimestamp } = useDatetime();

	const hasNoBridgeEvents = () => isNullable(settings.events_bridges_spb);
	const hasNoLightsEvents = () => isNullable(settings.events_lights);
	const hasNoSunEvents = () => isNullable(settings.events_sun);
	const hasNoMoonEvents = () => isNullable(settings.events_moon);

	const provider = useTimelineProvider({
		predicate: event => !timelineFilterSet().has(event.name) && event.timestamp >= getTimestamp(),
		providers: [
			{
				disabled: !isSupportsBridges() || hasNoBridgeEvents(),
				provider: getBridgeEvents,
				type: "DATE"
			},
			{
				disabled: !isSupportsCityLights() || hasNoLightsEvents(),
				provider: getEventsByDate,
				type: "DATE"
			},
			{
				disabled: hasNoMoonEvents(),
				provider: getMoonEvents,
				type: "LOCATION"
			},
			{
				disabled: hasNoSunEvents(),
				provider: getSunEvents,
				type: "LOCATION"
			}
		]
	});

	return provider;
}
