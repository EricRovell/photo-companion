import { For } from "solid-js";

import { Timeline, useTimelineProvider } from "~/entities/timeline";
import { TimelineEvent } from "~/entities/timeline-event";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { getSunEvents } from "~/features/timeline";
import { ROUTES } from "~/shared/consts";

import { useCityLights } from "../model";

import type { EventName } from "~/entities/timeline-event/types";

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
							href={ROUTES.LIGHTS}
							secondary={SECONDARY_EVENT_SET.has(event.name)}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
