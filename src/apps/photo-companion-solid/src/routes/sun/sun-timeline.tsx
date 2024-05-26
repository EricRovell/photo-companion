import { For } from "solid-js";

import { useLocation, useTimelineProvider } from "@lib/hooks";
import { Timeline, TimelineEvent } from "@lib/components";
import { ROUTE_SUN } from "@lib/consts";
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
					{event => <TimelineEvent href={ROUTE_SUN} event={event} />}
				</For>
			</Timeline>
		</section>
	);
}
