import { For } from "solid-js";

import type { EventName } from "types";

import { Timeline, TimelineEvent } from "@lib/components";
import { ROUTE } from "@lib/consts";
import { useCityLights } from "@lib/context/city-lights";
import { useSettings } from "@lib/context/settings";
import { useDatetime, useTimelineProvider } from "@lib/hooks";

import { getSunEvents } from "../../../services/sun";

const TIMELINE_EVENT_SET = new Set<EventName>([
	"LIGHTS_START",
	"LIGHTS_END",
	"SUNRISE_START",
	"SUNSET_END"
]);

const SECONDARY_EVENT_SET = new Set<EventName>([
	"SUNRISE_START",
	"SUNSET_END"
]);

export function LightsTimeline() {
	const { getDatetime } = useDatetime();
	const { settings } = useSettings();
	const { getEventsByDate } = useCityLights();
	const { getTimeline } = useTimelineProvider({
		predicate: event => TIMELINE_EVENT_SET.has(event.name),
		providers: [
			{
				provider: getEventsByDate,
				type: "DATE"
			},
			{
				provider: getSunEvents,
				type: "LOCATION"
			}
		]
	});

	const events = () => getTimeline(getDatetime(), settings.latitude, settings.longitude);

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => (
						<TimelineEvent
							event={event}
							href={ROUTE.LIGHTS}
							secondary={SECONDARY_EVENT_SET.has(event.name)}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
