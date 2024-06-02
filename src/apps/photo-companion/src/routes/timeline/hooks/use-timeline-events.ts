import { getBridgeEvents } from "bridge-schedule";
import { isNullable } from "utils/validators";

import { useSettings } from "@lib/context";
import { useDatetime, useLightsProvider, useTimelineProvider } from "@lib/hooks";

import { getMoonEvents } from "../../../services/moon";
import { getSunEvents } from "../../../services/sun";
import { useTimelineFilters } from "./use-timeline-filters";

export function useTimelineEvents() {
	const { getSettings } = useSettings();
	const { getLightsProvider } = useLightsProvider();
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
				provider: getLightsProvider().getEventsByDate,
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
