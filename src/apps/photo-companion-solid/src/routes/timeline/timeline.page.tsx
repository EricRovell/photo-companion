import { For, Show } from "solid-js";
import { Time, Icon } from "ui-solid";
import { iconWarning } from "ui-solid/icons";
import { incrementDateByDay } from "utils/date";

import { TimelineGroup, Timeline, TimelineEvent, TimelineEventEmpty } from "@lib/components";
import { settings } from "@stores/settings";
import { formatDate, t } from "@stores/lang";
import { useDatetime, useLocation } from "@lib/hooks";
import { hasSomeEvents } from "./timeline.helpers";
import { initTimelineProvider } from "../../services/events";
import type { EventsProps } from "./timeline.types";

import styles from "./timeline.module.css";

const NoEvents = () => (
	<article class={styles.warning}>
		<h2>{t().MESSAGE.EVENTS_ARE_DISABLED}</h2>
		<Icon path={iconWarning} />
	</article>
);

const Events = (props: EventsProps) => (
	<TimelineGroup>
		<For each={props.timeline}>
			{({ date, items }) => (
				<Timeline date={<Time>{formatDate(date)}</Time>}>
					<For each={items} fallback={<TimelineEventEmpty />}>
						{event => <TimelineEvent event={event} />}
					</For>
				</Timeline>
			)}
		</For>
	</TimelineGroup>
);

export function PageTimeline() {
	const { date } = useDatetime();
	const { latitude, longitude } = useLocation();

	const hasEvents = () => hasSomeEvents(settings());

	const provider = () => {
		const store = settings();
		const time = date().getTime();

		return initTimelineProvider({
			bridgeEvents: store.events_bridges_spb,
			lightsEvents: store.events_lights,
			moonEvents: store.events_moon,
			sunEvents: store.events_sun,
			predicate: (event) => event.timestamp >= time
		});
	};

	const timeline = () => {
		const tomorrow = incrementDateByDay(date(), 1);

		return [
			{
				date: date(),
				items: provider().getEvents(date(), latitude(), longitude())
			},
			{
				date: tomorrow,
				items: provider().getEvents(tomorrow, latitude(), longitude())
			}
		];
	};

	return (
		<div class={styles.page}>
			<Show when={hasEvents()} fallback={<NoEvents />}>
				<Events timeline={timeline()} />
			</Show>
		</div>
	);
}
