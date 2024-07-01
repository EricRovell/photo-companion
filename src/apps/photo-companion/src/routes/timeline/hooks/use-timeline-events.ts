import { getBridgeEvents } from "bridge-schedule";
import { isNullable } from "utils/validators";

import { useCityLights, useSettings } from "@lib/context";
import { useDatetime, useTimelineProvider } from "@lib/hooks";

import { getMoonEvents } from "../../../services/moon";
import { getSunEvents } from "../../../services/sun";
import { useTimelineFilters } from "./use-timeline-filters";

export function useTimelineEvents() {
	const { getSettings } = useSettings();
	const { getEventsByDate } = useCityLights();
	const timelineFilterSet = useTimelineFilters();
	const { getTimestamp } = useDatetime();

	const provider = useTimelineProvider({
		predicate: event => !timelineFilterSet.has(event.name) && event.timestamp >= getTimestamp(),
		providers: [
			{
				disabled: isNullable(getSettings().events_bridges_spb),
				provider: getBridgeEvents,
				type: "DATE"
			},
			{
				disabled: isNullable(getSettings().events_lights),
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
