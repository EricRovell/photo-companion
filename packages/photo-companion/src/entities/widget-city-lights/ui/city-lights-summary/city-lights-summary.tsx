import { Show } from "solid-js";

import type { Accessor } from "solid-js";

import { Text } from "~/shared/ui";

import { CityLightsCountdown } from "../city-lights-countdown";

import styles from "./city-lights-summary.module.css";

interface Props {
	countdown: {
		duration: number;
		timestamp: number;
	} | null;
	countdownLabel: string;
	duration: string;
	durationLabel: string;
	estimated: boolean;
	getTimerTimestamp?: Accessor<number>;
}

export function CityLightsSummary(props: Props) {
	return (
		<dl class={styles.summary}>
			<div class={styles.stat}>
				<Text
					as="dt"
					color="secondary"
					leading="relaxed"
					variant="text-xs"
				>
					{props.durationLabel}
				</Text>
				<Text
					as="dd"
					color="secondary"
					numeric
					variant="text-m"
				>
					{props.duration}
				</Text>
			</div>
			<div class={styles.stat} data-lights-countdown>
				<Text
					as="dt"
					color="secondary"
					leading="relaxed"
					variant="text-xs"
				>
					{props.countdownLabel}
				</Text>
				<Text
					as="dd"
					color="primary"
					numeric
					variant="heading-l"
				>
					{props.estimated && props.countdown ? "≈ " : ""}
					<Show when={props.countdown} fallback="—" keyed>
						{value => <CityLightsCountdown
							duration={value.duration}
							getTimerTimestamp={props.getTimerTimestamp}
							timestamp={value.timestamp}
						/>}
					</Show>
				</Text>
			</div>
		</dl>
	);
}
