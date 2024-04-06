import { Time, Link } from "ui-solid";

import { formatTimeShort, formatDatetime, type Translation, t } from "@lib/stores/lang";
import { lightsEventComponent } from "./timeline-event-lights";
import { bridgeEventComponent } from "./timeline-event-bridge";
import { sunEventComponent } from "./timeline-event-sun";
import { moonEventComponent } from "./timeline-event-moon";

import {
	isBridgeEvent,
	isLightsEvent,
	isMoonEvent,
	isSunEvent
} from "@lib/helpers/validators";

//import { createQueryDate } from "@lib/helpers";
import type { TimelineEvent } from "types";
import styles from "./event.module.css";
import type { Accessor } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Show } from "solid-js";

const eventComponent = (event: TimelineEvent, t: Accessor<Translation>) => {
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
	const data = () => eventComponent(props.event, t);
	const linkTitle = () => `${data().title}: ${formatDatetime(new Date(props.event.timestamp))}`;

	return (
		<li
			class={styles.event}
			//aria-current={props.current ? "date" : undefined}
			aria-secondary={props.secondary ? "" : undefined}
			data-event-name={props.event.name}
		>
			<Time>
				{formatTimeShort(props.event.timestamp)}
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
