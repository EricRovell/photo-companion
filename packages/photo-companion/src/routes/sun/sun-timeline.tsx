import { For } from "solid-js";

import { Timeline, TimelineEvent } from "~/components";
import { ROUTES } from "~/consts";
import { useTimelineProvider } from "~/hooks";
import { useSettings } from "~/services/settings";
import { getSunEvents } from "~/services/sun";

interface SunTimelineProps {
	date: Date;
}

export function SunTimeline(props: SunTimelineProps) {
	const { settings } = useSettings();
	const { getTimeline } = useTimelineProvider({
		providers: [
			{
				provider: getSunEvents,
				type: "LOCATION"
			}
		]
	});

	const events = () => getTimeline(props.date, settings.latitude, settings.longitude);

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
