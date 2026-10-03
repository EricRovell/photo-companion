import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { setAttribute } from "utils";

import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { createQueryDate } from "~/shared/lib/query-date";
import { Text } from "~/shared/ui";

import { buildEventComponent } from "../../lib/build-timeline-event";

import type { TimelineEvent } from "../../types";

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
			<Text as="time" color={current() ? "success" : props.secondary ? "secondary" : "inherit"} numeric variant={current() ? "heading-s" : "text-s"}>
				{format().timeShort(props.event.timestamp)}
			</Text>
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
				<Text
					align="start"
					as="p"
					balance
					color={current() ? "success" : props.secondary ? "secondary" : "inherit"}
					variant={current() ? "heading-s" : props.secondary ? "text-xs" : "text-s"}
				>
					{data().title}
				</Text>
				<Show when={data().message}>
					{message => <Text align="start" as="p" balance color="secondary" variant="text-xs">{message()}</Text>}
				</Show>
			</article>
		</li>
	);
}
