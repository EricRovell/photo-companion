import { For, Show } from "solid-js";
import { Time, IconWarning } from "ui-solid";
import { incrementDateByDay } from "utils/date";
import type { EventGroupName } from "types";

import { useTranslation } from "@lib/context";
import { TimelineGroup, Timeline, TimelineEvent, TimelineEventEmpty } from "@lib/components";
import { useDatetime, useLocation } from "@lib/hooks";
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
							{event => <TimelineEvent href={createEventLink(event.type)} event={event} />}
						</For>
					</Timeline>
				)}
			</For>
		</TimelineGroup>
	);
}

export function PageTimeline() {
	const { getDatetime } = useDatetime();
	const { getLatitude, getLongitude } = useLocation();
	const { getTimeline } = useTimelineEvents();
	const disabled = useDisabledTimeline();

	const timeline = () => {
		const tomorrow = incrementDateByDay(getDatetime(), 1);

		return [
			{
				date: getDatetime(),
				items: getTimeline(getDatetime(), getLatitude(), getLongitude())
			},
			{
				date: tomorrow,
				items: getTimeline(tomorrow, getLatitude(), getLongitude())
			}
		];
	};

	return (
		<div class={styles.page}>
			<Show when={disabled} fallback={<NoEvents />}>
				<Events timeline={timeline()} />
			</Show>
		</div>
	);
}
