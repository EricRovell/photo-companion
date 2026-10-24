import { For, Show } from "solid-js";

import { Text } from "~/shared/ui";

import type { CityLightsEventData } from "../../types";

import styles from "./city-lights-legend.module.css";

interface Props {
	events: CityLightsEventData[];
	id: string;
}

export function CityLightsLegend(props: Props) {
	return (
		<dl class={styles.events} id={props.id}>
			<For each={props.events}>
				{event => (
					<div class={styles.event} data-event={event.name}>
						<Text as="dt" color="secondary" variant="text-xs">
							{event.label}
						</Text>
						<Text as="dd" numeric variant="heading-s">
							{event.time}
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
