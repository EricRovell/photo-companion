import { For, createMemo } from "solid-js";

import { Timeline, TimelineEvent } from "@lib/components";
import { initTimelineProvider } from "../../services/events";
import { SUN_EVENT_NAMES } from "@lib/constants";

interface MoonTimelineProps {
	date: Date;
	latitude: number;
	longitude: number;
}

const timelineProvider = initTimelineProvider({
	moonEvents: [],
	sunEvents: SUN_EVENT_NAMES.filter(item => item !== "SUNRISE_START" && item !== "SUNSET_END"),
	secondaryEvents: new Set([ "SUNRISE_START", "SUNSET_END" ])
});

export function MoonTimeline(props: MoonTimelineProps) {
	const events = createMemo(() => {
		return timelineProvider.getEvents(props.date, props.latitude, props.longitude);
	});

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => (
						<TimelineEvent
							event={event}
							secondary={event.secondary}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
