import { For, Show } from "solid-js";
import { Time, IconWarning } from "ui-solid";
import { incrementDateByDay } from "utils/date";

import { useTranslation } from "@lib/context";
import { TimelineGroup, Timeline, TimelineEvent, TimelineEventEmpty } from "@lib/components";
import { useDatetime, useLocation } from "@lib/hooks";
import { useDisabledTimeline, useTimelineEvents } from "./hooks";
import type { EventsProps } from "./timeline.types";

import styles from "./timeline.module.css";

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
							{event => <TimelineEvent event={event} />}
						</For>
					</Timeline>
				)}
			</For>
		</TimelineGroup>
	);
}

export function PageTimeline() {
	const { date } = useDatetime();
	const { getLatitude, getLongitude } = useLocation();
	const { getTimeline } = useTimelineEvents();
	const disabled = useDisabledTimeline();

	const timeline = () => {
		const tomorrow = incrementDateByDay(date(), 1);

		return [
			{
				date: date(),
				items: getTimeline(date(), getLatitude(), getLongitude())
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
