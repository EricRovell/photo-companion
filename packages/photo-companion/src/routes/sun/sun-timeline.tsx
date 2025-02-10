import { For } from "solid-js";

import { Timeline, TimelineEvent } from "~/lib/components";
import { ROUTES } from "~/lib/consts";
import { useSettings } from "~/lib/context/settings";
import { useTimelineProvider } from "~/lib/hooks";
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
