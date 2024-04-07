import { For } from "solid-js";

import { Timeline, TimelineEvent } from "@lib/components";
import { useDatetime, useLocation } from "@lib/hooks";
import { SUN_EVENT_NAMES } from "@lib/constants";
import { initTimelineProvider } from "../../services/events";

export function LightsTimeline() {
	const { date } = useDatetime();
	const { latitude, longitude } = useLocation();

	const provider = initTimelineProvider({
		lightsEvents: [],
		sunEvents: SUN_EVENT_NAMES.filter(item => item !== "SUNRISE_START" && item !== "SUNSET_END"),
		secondaryEvents: new Set([ "SUNRISE_START", "SUNSET_END" ])
	});

	const events = () => provider.getEvents(date(), latitude(), longitude());
	
	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{item => (
						<TimelineEvent
							event={item}
							secondary={item.secondary}
						/>
					)}
				</For>
			</Timeline>
		</section>
	);
}
