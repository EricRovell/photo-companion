import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Time, Link } from "ui-solid";
import type { TimelineEvent } from "types";
//import { createQueryDate } from "@lib/helpers";

import { useTranslation } from "@lib/context";
import {
	isBridgeEvent,
	isLightsEvent,
	isMoonEvent,
	isSunEvent
} from "@lib/helpers/validators";

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

interface EventProps {
	page?: string;
	event: TimelineEvent;
	secondary?: boolean;
}

export function TimelineEvent(props: EventProps) {
	const { formatters } = useTranslation();
	const data = () => eventComponent(props.event);
	const linkTitle = () => `${data().title}: ${formatters().formatDatetime(new Date(props.event.timestamp))}`;

	return (
		<li
			class={styles.event}
			//aria-current={props.current ? "date" : undefined}
			data-secondary={props.secondary ? "" : undefined}
			data-event-name={props.event.name}
		>
			<Time>
				{formatters().formatTimeShort(props.event.timestamp)}
			</Time>
			<div class={styles.icon} data-event-icon>
				<Link
					class={styles.link}
					href="/"
					title={linkTitle()}
				>
					<Dynamic component={data().component} {...data().props} />
				</Link>
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
