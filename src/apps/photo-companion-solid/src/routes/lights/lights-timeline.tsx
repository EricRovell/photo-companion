import { For } from "solid-js";
import type { EventName } from "types";

import { Timeline, TimelineEvent } from "@lib/components";
import { ROUTE } from "@lib/consts";
import { useDatetime, useLightsProvider, useLocation, useTimelineProvider } from "@lib/hooks";
import { getSunEvents } from "../../services/sun";

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
	const { getLatitude, getLongitude } = useLocation();
	const { getLightsProvider } = useLightsProvider();
	const { getTimeline } = useTimelineProvider({
		providers: [
			{
				provider: getLightsProvider().getEventsByDate,
				type: "DATE"
			},
			{
				provider: getSunEvents,
				type: "LOCATION"
			}
		],
		predicate: event => TIMELINE_EVENT_SET.has(event.name)
	});

	const events = () => getTimeline(getDatetime(), getLatitude(), getLongitude());

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => (
						<TimelineEvent
							href={ROUTE.LIGHTS}
							event={event}
							secondary={SECONDARY_EVENT_SET.has(event.name)}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
