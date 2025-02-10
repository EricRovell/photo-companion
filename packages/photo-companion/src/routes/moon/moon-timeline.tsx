import { createMemo, For } from "solid-js";

import type { EventName } from "types";

import { Timeline, TimelineEvent } from "~/lib/components";
import { ROUTES } from "~/lib/consts";
import { useSettings } from "~/lib/context/settings";
import { useTimelineProvider } from "~/lib/hooks";
import { getMoonEvents } from "~/services/moon";
import { getSunEvents } from "~/services/sun";

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
	const { settings } = useSettings();

	const { getTimeline } = useTimelineProvider({
		predicate: event => TIMELINE_EVENT_SET.has(event.name),
		providers: [
			{
				provider: getSunEvents,
				type: "LOCATION"
			},
			{
				provider: getMoonEvents,
				type: "LOCATION"
			}
		]
	});

	const events = createMemo(() => {
		return getTimeline(props.date, settings.latitude, settings.longitude);
	});

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => (
						<TimelineEvent
							event={event}
							href={ROUTES.MOON}
							secondary={SECONDARY_EVENT_SET.has(event.name)}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
