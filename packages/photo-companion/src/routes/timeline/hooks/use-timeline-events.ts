import { getBridgeEvents } from "bridge-schedule";
import { isNullable } from "utils/validators";

import { useCityLights } from "@lib/context/city-lights";
import { useSettings } from "@lib/context/settings";
import { useSupportsBridges, useSupportsLights } from "@lib/hooks";
import { useDatetime, useTimelineProvider } from "@lib/hooks";

import { getMoonEvents } from "../../../services/moon";
import { getSunEvents } from "../../../services/sun";
import { useTimelineFilters } from "./use-timeline-filters";

/*
	TODO: think about code-splitting,
	as some providers can be deactivated or not available,
	but the code is loaded nevertheless.
*/

export function useTimelineEvents() {
	const { settings } = useSettings();

	const timelineFilterSet = useTimelineFilters();
	const { getEventsByDate } = useCityLights();
	const { getTimestamp } = useDatetime();

	const supportsLights = useSupportsLights();
	const supportsBridges = useSupportsBridges();

	const hasNoBridgeEvents = () => isNullable(settings.events_bridges_spb);
	const hasNoLightsEvents = () => isNullable(settings.events_lights);
	const hasNoSunEvents = () => isNullable(settings.events_sun);
	const hasNoMoonEvents = () => isNullable(settings.events_moon);

	const provider = useTimelineProvider({
		predicate: event => !timelineFilterSet().has(event.name) && event.timestamp >= getTimestamp(),
		providers: [
			{
				disabled: !supportsBridges() || hasNoBridgeEvents(),
				provider: getBridgeEvents,
				type: "DATE"
			},
			{
				disabled: !supportsLights() || hasNoLightsEvents(),
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
