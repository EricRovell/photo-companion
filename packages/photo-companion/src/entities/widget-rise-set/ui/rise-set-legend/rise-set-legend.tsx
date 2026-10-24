import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import type { RiseSetEventData, RiseSetTimeRenderer } from "../../types";

import styles from "./rise-set-legend.module.css";

interface EventProps {
	event: RiseSetEventData;
	renderTime?: RiseSetTimeRenderer;
}

interface Props extends Omit<EventProps, "event"> {
	rise: RiseSetEventData;
	set: RiseSetEventData;
}

function RiseSetEvent(props: EventProps) {
	const { format } = useTranslation();
	const fullDate = () => props.event.date ? format().dateShort(props.event.date) : undefined;

	return (
		<div class={styles.event}>
			<span class={styles.label}>
				{props.event.label}
			</span>
			<Text
				as="time"
				dateTime={props.event.date?.toISOString()}
				numeric
				title={fullDate()}
				variant="heading-s"
			>
				{props.event.date && props.renderTime
					? props.renderTime(props.event.date, props.event.time, `${props.event.label}: ${props.event.time}, ${fullDate()}`)
					: props.event.time}
			</Text>
			<span class={styles.day} data-event-day title={fullDate()}>
				{props.event.day}
			</span>
		</div>
	);
}

export function RiseSetLegend(props: Props) {
	return (
		<div class={styles.legend}>
			<RiseSetEvent
				event={props.rise}
				renderTime={props.renderTime}
			/>
			<RiseSetEvent
				event={props.set}
				renderTime={props.renderTime}
			/>
		</div>
	);
}
