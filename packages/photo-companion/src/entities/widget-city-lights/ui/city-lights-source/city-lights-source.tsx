import { Show } from "solid-js";

import { Text } from "~/shared/ui";

import styles from "./city-lights-source.module.css";

interface Props {
	id: string;
	label: string;
	uncertainty: null | string;
}

export function CityLightsSource(props: Props) {
	return (
		<div class={styles.source} id={props.id}>
			<span
				aria-hidden="true"
				class={styles.sample}
				data-estimated={props.uncertainty ? "" : undefined}
			/>
			<Text variant="text-xs">
				{props.label}
			</Text>
			<Show when={props.uncertainty}>
				<Text color="secondary" variant="text-xs">{props.uncertainty}</Text>
			</Show>
		</div>
	);
}
