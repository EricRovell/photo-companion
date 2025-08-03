import { For } from "solid-js";

import { TimelineEvent } from "~/components";
import { ROUTES } from "~/consts";
import { Timeline, useTimelineProvider } from "~/entities/timeline";
import { useDatetime } from "~/hooks";
import { useSettings } from "~/services/settings";
import { getSunEvents } from "~/services/sun";

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
