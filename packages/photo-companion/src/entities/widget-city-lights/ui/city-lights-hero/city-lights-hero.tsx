import { Show } from "solid-js";

import { Bulb } from "~/entities/city-lights";
import { Text } from "~/shared/ui";

import styles from "./city-lights-hero.module.css";

interface Props {
	lights: boolean;
	state: string;
	status: null | string;
	switchingWindowLabel: string;
	withinWindow: boolean;
}

export function CityLightsHero(props: Props) {
	return (
		<div class={styles.hero}>
			<div
				aria-hidden="true"
				class={styles.lamp}
				data-on={props.lights ? "" : undefined}
				data-uncertain={props.withinWindow ? "" : undefined}
			>
				<Bulb glow={props.lights} height="72" width="72" />
			</div>
			<Text as="p" class={styles.state} variant="heading-s">
				{props.state}
			</Text>
			<Text
				aria-hidden={!props.withinWindow}
				as="p"
				class={styles.window}
				color="secondary"
				variant="text-xs"
			>
				{props.switchingWindowLabel}
			</Text>
			<Show when={props.status}>
				<Text align="center" as="p" color="secondary" variant="text-s">
					{props.status}
				</Text>
			</Show>
		</div>
	);
}
