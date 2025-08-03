import { For, Show } from "solid-js";
import { incrementDateByDay } from "utils/date";

import type { EventGroupName } from "types";

import { TimelineEvent, TimelineEventEmpty } from "~/components";
import { Timeline, TimelineGroup } from "~/entities/timeline";
import { CityLightsProvider } from "~/features/city-lights";
import { useSettings } from "~/features/settings";
import { useTranslation } from "~/features/translation";
import { useDatetime } from "~/hooks";
import { IconWarning } from "~/shared/ui/icons";

import { useDisabledTimeline, useTimelineEvents } from "./hooks";

import type { EventsProps } from "./timeline.types";

import styles from "./timeline.module.css";

const createEventLink = (type: EventGroupName) => {
	if (type === "BRIDGE") {
		return "/bridges";
	}

	return `/${type.toLowerCase()}`;
};

function NoEvents() {
	const { t } = useTranslation();

	return (
		<article class={styles.warning}>
			<h2>{t().MESSAGE.EVENTS_ARE_DISABLED}</h2>
			<IconWarning />
		</article>
	);
}

function Events(props: EventsProps) {
	const { format } = useTranslation();

	return (
		<TimelineGroup>
			<For each={props.timeline}>
				{({ date, items }) => (
					<Timeline date={format().date(date)}>
						<For each={items} fallback={<TimelineEventEmpty />}>
							{event => <TimelineEvent event={event} href={createEventLink(event.type)} />}
						</For>
					</Timeline>
				)}
			</For>
		</TimelineGroup>
	);
}

function EventTimeline() {
	const { getDatetime } = useDatetime();
	const { settings } = useSettings();
	const { getTimeline } = useTimelineEvents();
	const disabled = useDisabledTimeline();

	const timeline = () => {
		const tomorrow = incrementDateByDay(getDatetime(), 1);

		return [
			{
				date: getDatetime(),
				items: getTimeline(getDatetime(), settings.latitude, settings.longitude)
			},
			{
				date: tomorrow,
				items: getTimeline(tomorrow, settings.latitude, settings.longitude)
			}
		];
	};

	return (
		<div class={styles.page}>
			<Show fallback={<NoEvents />} when={disabled}>
				<Events timeline={timeline()} />
			</Show>
		</div>
	);
}

export const PageTimeline = () => (
	<CityLightsProvider>
		<EventTimeline />
	</CityLightsProvider>
);

export default PageTimeline;
