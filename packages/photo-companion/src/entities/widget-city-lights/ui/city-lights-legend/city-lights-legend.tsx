import { For, Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import type { CityLightsEventData, CityLightsTimeRenderer } from "../../types";

import styles from "./city-lights-legend.module.css";

interface Props {
	events: CityLightsEventData[];
	id: string;
	renderTime?: CityLightsTimeRenderer;
}

export function CityLightsLegend(props: Props) {
	const { format } = useTranslation();
	const fullDate = (event: CityLightsEventData) => event.date ? format().dateShort(event.date) : undefined;

	return (
		<dl class={styles.events} id={props.id}>
			<For each={props.events}>
				{event => (
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
						<Text as="dd" color="secondary" variant="text-xs">
							{event.day}
						</Text>
						<Show when={event.range}>
							<Text as="dd" class={styles.range} numeric variant="text-xs">
								{event.range}
							</Text>
						</Show>
					</div>
				)}
			</For>
		</dl>
	);
}
