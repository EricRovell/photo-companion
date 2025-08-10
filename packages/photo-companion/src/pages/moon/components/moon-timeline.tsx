import { createMemo, For } from "solid-js";

import type { EventName } from "types";

import { TimelineEvent } from "~/components";
import { Timeline, useTimelineProvider } from "~/entities/timeline";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { getMoonEvents, getSunEvents } from "~/features/timeline";
import { ROUTES } from "~/shared/consts";

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

export function MoonTimeline() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

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
		return getTimeline(getDatetime(), settings.latitude, settings.longitude);
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
