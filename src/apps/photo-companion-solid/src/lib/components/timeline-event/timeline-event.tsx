import { Show } from "solid-js";
import { useMatch } from "@solidjs/router";
import { Dynamic } from "solid-js/web";
import { Time } from "ui-solid";
import type { TimelineEvent } from "types";

import { useTranslation } from "@lib/context";
import { createQueryDate, setAttribute } from "@lib/helpers";
import { isBridgeEvent, isLightsEvent, isMoonEvent, isSunEvent } from "@lib/helpers/validators";
import { LinkQuery } from "../link-query";

import { lightsEventComponent } from "./timeline-event-lights";
import { bridgeEventComponent } from "./timeline-event-bridge";
import { sunEventComponent } from "./timeline-event-sun";
import { moonEventComponent } from "./timeline-event-moon";

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
	href: string;
	event: TimelineEvent;
	secondary?: boolean;
}

const HREF_FALLBACK = "/#";

export function TimelineEvent(props: TimelineEventProps) {
	const match = useMatch(() => props.href ?? HREF_FALLBACK);
	const { formatters } = useTranslation();
	const data = () => eventComponent(props.event);
	const linkTitle = () => `${data().title}: ${formatters().formatDatetime(new Date(props.event.timestamp))}`;

	return (
		<li
			class={styles.event}
			aria-current={match() ? "date" : undefined}
			data-secondary={setAttribute(props.secondary)}
			data-event-name={props.event.name}
		>
			<Time>
				{formatters().formatTimeShort(props.event.timestamp)}
			</Time>
			<div class={styles.icon} data-event-icon>
				<LinkQuery
					class={styles.link}
					href={props.href ?? HREF_FALLBACK}
					title={linkTitle()}
					query={new URLSearchParams({
						date: createQueryDate(props.event.timestamp)
					})}
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
