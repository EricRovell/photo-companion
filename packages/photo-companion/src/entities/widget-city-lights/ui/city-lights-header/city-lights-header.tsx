import { Show } from "solid-js";

import { Card, Text } from "~/shared/ui";

import styles from "./city-lights-header.module.css";

interface Props {
	city: null | string;
	title: string;
}

export function CityLightsHeader(props: Props) {
	return (
		<Card.Header class={styles.header}>
			<Text
				align="start"
				as="h2"
				class={styles.title}
				variant="heading-l"
			>
				{props.title}
			</Text>
			<Show when={props.city}>
				<Text
					align="end"
					class={styles.city}
					color="secondary"
					variant="text-xs"
				>
					{props.city}
				</Text>
			</Show>
		</Card.Header>
	);
}
