import { For } from "solid-js";

import { Timeline, useTimelineProvider } from "~/entities/timeline";
import { TimelineEvent } from "~/entities/timeline-event";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { getSunEvents } from "~/features/timeline";
import { ROUTES } from "~/shared/consts";

export function SunTimeline() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();
	const { getTimeline } = useTimelineProvider({
		providers: [
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
					{event => <TimelineEvent event={event} href={ROUTES.SUN} />}
				</For>
			</Timeline>
		</section>
	);
}
