import { getBridgeEvents } from "bridge-schedule";
import { isNullable } from "utils/validators";

import { useCityLights, useSettings } from "@lib/context";
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
	const timelineFilterSet = useTimelineFilters();
	const { getSettings } = useSettings();
	const { getEventsByDate } = useCityLights();
	const { getTimestamp } = useDatetime();

	const supportsLights = useSupportsLights();
	const supportsBridges = useSupportsBridges();

	const provider = useTimelineProvider({
		predicate: event => !timelineFilterSet.has(event.name) && event.timestamp >= getTimestamp(),
		providers: [
			{
				disabled: !supportsBridges() || isNullable(getSettings().events_bridges_spb),
				provider: getBridgeEvents,
				type: "DATE"
			},
			{
				disabled: !supportsLights() || isNullable(getSettings().events_lights),
				provider: getEventsByDate,
				type: "DATE"
			},
			{
				disabled: isNullable(getSettings().events_moon),
				provider: getMoonEvents,
				type: "LOCATION"
			},
			{
				disabled: isNullable(getSettings().events_sun),
				provider: getSunEvents,
				type: "LOCATION"
			}
		]
	});

	return provider;
}
