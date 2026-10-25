import { For, Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import type { CityLightsEventData, CityLightsTimeRenderer } from "../../types";

import styles from "./city-lights-legend.module.css";

interface Props {
	events: CityLightsEventData[];
	id: string;
	renderTime?: CityLightsTimeRenderer;
	reservedEvents: CityLightsEventData[];
}

export function CityLightsLegend(props: Props) {
	const { format } = useTranslation();
	const fullDate = (event: CityLightsEventData) => event.date ? format().dateShort(event.date) : undefined;

	return (
		<dl class={styles.events} id={props.id}>
			<For each={props.events}>
				{event => {
					const reservedDetails = () => {
						const reserved = props.reservedEvents.find(item => item.name === event.name) ?? event;
						return [ reserved.day, reserved.range ].filter(Boolean).join(" · ");
					};

					return (
						<div class={styles.event} data-event={event.name}>
							<Text as="dt" color="secondary" variant="text-xs">
								{event.label}
							</Text>
							<Text as="dd" numeric variant="heading-s">
								<time
									dateTime={event.date?.toISOString()}
									title={fullDate(event)}
								>
									{event.date && props.renderTime
										? props.renderTime(event.date, event.time, `${event.label}: ${event.time}, ${fullDate(event)}`)
										: event.time}
								</time>
							</Text>
							<Text
								as="dd"
								class={styles.details}
								color="secondary"
								numeric
								variant="text-xs"
							>
								<span aria-hidden="true" class={styles.measure}>
									{reservedDetails()}
								</span>
								<span>
									<span>{event.day}</span>
									<Show when={event.range}>
										<span> · </span>
										<span class={styles.range}>{event.range}</span>
									</Show>
								</span>
							</Text>
						</div>
					);
				}}
			</For>
		</dl>
	);
}
