import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { setAttribute } from "utils";

import type { TimelineEvent } from "types";

import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";
import { Time } from "~/shared/ui";

import { buildEventComponent } from "../../lib/build-timeline-event";

import styles from "./timeline-event.module.css";

interface TimelineEventProps {
	event: TimelineEvent;
	href?: string;
	secondary?: boolean;
}

const HREF_FALLBACK = "/#";

export function TimelineEvent(props: TimelineEventProps) {
	const { getTimestamp } = useDatetime();
	const { format } = useTranslation();
	const data = () => buildEventComponent(props.event);
	const linkTitle = () => `${data().title}: ${format().datetime(props.event.timestamp)}`;

	// `datetime` query is taking only minutes into consideration, need to round up
	const current = () => Math.abs(getTimestamp() - props.event.timestamp) < 60000;

	return (
		<li
			aria-current={current() ? "date" : undefined}
			class={styles.event}
			data-event-name={props.event.name}
			data-secondary={setAttribute(props.secondary)}
		>
			<Time>
				{format().timeShort(props.event.timestamp)}
			</Time>
			<div class={styles.icon} data-event-icon>
				<LinkQuery
					class={styles.link}
					href={props.href ?? HREF_FALLBACK}
					query={new URLSearchParams({
						datetime: createQueryDate(props.event.timestamp)
					})}
					title={linkTitle()}
				>
					<Dynamic component={data().component} {...data().props} />
				</LinkQuery>
			</div>
			<article>
				<p>{data().title}</p>
				<Show when={data().message}>
					{message => <p>{message()}</p>}
				</Show>
			</article>
		</li>
	);
}
