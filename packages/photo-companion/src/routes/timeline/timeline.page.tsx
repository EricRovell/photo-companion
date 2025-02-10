import { For, Show } from "solid-js";
import { Time } from "ui";
import { IconWarning } from "ui/icons";
import { incrementDateByDay } from "utils/date";

import type { EventGroupName } from "types";

import { Timeline, TimelineEvent, TimelineEventEmpty, TimelineGroup } from "~/lib/components";
import { useDatetime } from "~/lib/hooks";
import { CityLightsProvider } from "~/services/city-lights";
import { useSettings } from "~/services/settings";
import { useTranslation } from "~/services/translation";

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
	const { formatters } = useTranslation();

	return (
		<TimelineGroup>
			<For each={props.timeline}>
				{({ date, items }) => (
					<Timeline date={<Time>{formatters().formatDate(date)}</Time>}>
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
