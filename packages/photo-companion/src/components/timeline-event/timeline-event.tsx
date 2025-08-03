import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import type { TimelineEvent } from "types";

import { useTranslation } from "~/features/translation";
import { createQueryDate, setAttribute } from "~/helpers";
import { useDatetime } from "~/hooks";
import { Time } from "~/shared/ui";

import { LinkQuery } from "../link-query";
import { bridgeEventComponent } from "./timeline-event-bridge";
import { lightsEventComponent } from "./timeline-event-lights";
import { moonEventComponent } from "./timeline-event-moon";
import { sunEventComponent } from "./timeline-event-sun";
import { isBridgeEvent, isLightsEvent, isMoonEvent, isSunEvent } from "./validators";

import styles from "./event.module.css";

const eventComponent = (event: TimelineEvent) => {
	const { t } = useTranslation();

	if (isBridgeEvent(event)) {
		return bridgeEventComponent(event, t());
	}

	if (isLightsEvent(event)) {
		return lightsEventComponent(event, t());
	}

	if (isMoonEvent(event)) {
		return moonEventComponent(event, t());
	}

	if (isSunEvent(event)) {
		return sunEventComponent(event, t());
	}

	throw new Error(`Unknown event is provided: ${JSON.stringify(event)}`);
};

interface TimelineEventProps {
	event: TimelineEvent;
	href?: string;
	secondary?: boolean;
}

const HREF_FALLBACK = "/#";

export function TimelineEvent(props: TimelineEventProps) {
	const { getTimestamp } = useDatetime();
	const { format } = useTranslation();
	const data = () => eventComponent(props.event);
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
