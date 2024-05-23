import { For, createMemo } from "solid-js";
import type { EventName } from "types";

import { Timeline, TimelineEvent } from "@lib/components";
import { useLocation, useTimelineProvider } from "@lib/hooks";
import { getSunEvents } from "../../services/sun";
import { getMoonEvents } from "../../services/moon";

interface MoonTimelineProps {
	date: Date;
}

const TIMELINE_EVENT_SET = new Set<EventName>([
	"SUNRISE_START",
	"SUNRISE_END",
	"MOONRISE",
	"MOONSET"
]);

const SECONDARY_EVENT_SET = new Set<EventName>([
	"SUNRISE_START",
	"SUNRISE_END"
]);

export function MoonTimeline(props: MoonTimelineProps) {
	const { getLatitude, getLongitude } = useLocation();

	const { getTimeline } = useTimelineProvider({
		providers: [
			{
				provider: getSunEvents,
				type: "LOCATION"
			},
			{
				provider: getMoonEvents,
				type: "LOCATION"
			}
		],
		predicate: event => TIMELINE_EVENT_SET.has(event.name)
	});

	const events = createMemo(() => {
		return getTimeline(props.date, getLatitude(), getLongitude());
	});

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => (
						<TimelineEvent
							event={event}
							secondary={SECONDARY_EVENT_SET.has(event.name)}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
