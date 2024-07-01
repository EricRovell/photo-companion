import { For } from "solid-js";

import { Timeline, TimelineEvent } from "@lib/components";
import { ROUTE_SUN } from "@lib/consts";
import { useLocation, useTimelineProvider } from "@lib/hooks";

import { getSunEvents } from "../../services/sun";

interface SunTimelineProps {
	date: Date;
}

export function SunTimeline(props: SunTimelineProps) {
	const { getLatitude, getLongitude } = useLocation();
	const { getTimeline } = useTimelineProvider({
		providers: [
			{
				provider: getSunEvents,
				type: "LOCATION"
			}
		]
	});

	const events = () => getTimeline(props.date, getLatitude(), getLongitude());

	return (
		<section data-label="timeline">
			<Timeline>
				<For each={events()}>
					{event => <TimelineEvent event={event} href={ROUTE_SUN} />}
				</For>
			</Timeline>
		</section>
	);
}
