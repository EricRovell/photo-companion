import { For, createMemo } from "solid-js";

import { Timeline, TimelineEvent } from "@lib/components";
import { initTimelineProvider } from "../../services/events";

interface SunTimelineProps {
	date: Date;
	latitude: number;
	longitude: number;
}

const timelineProvider = initTimelineProvider({
	sunEvents: []
});

export function SunTimeline(props: SunTimelineProps) {
	const events = createMemo(() => {
		return timelineProvider.getEvents(props.date, props.latitude, props.longitude);
	});

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => <TimelineEvent event={event} />}
				</For>
			</Timeline>
		</section>
	);
}
