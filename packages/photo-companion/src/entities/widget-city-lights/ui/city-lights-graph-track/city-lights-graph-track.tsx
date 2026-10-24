import { For, Show } from "solid-js";

import type { CityLightsNight } from "../../types";

import styles from "./city-lights-graph-track.module.css";

type Props = Pick<CityLightsNight, "intervals" | "ticks">;

export function CityLightsGraphTrack(props: Props) {
	return (
		<>
			<div class={styles.rail} />
			<For each={props.intervals}>
				{interval => (
					<>
						<div
							class={styles.interval}
							style={{
								left: `${interval.start}%`,
								width: `${interval.end - interval.start}%`
							}}
						/>
						<div
							class={styles.core}
							style={{
								left: `${interval.innerStart}%`,
								width: `${interval.innerEnd - interval.innerStart}%`
							}}
						/>
					</>
				)}
			</For>
			<For each={props.ticks}>
				{tick => (
					<Show when={tick.time.getHours() === 0}>
						<div class={styles.midnight} style={{ left: `${tick.position}%` }} />
					</Show>
				)}
			</For>
		</>
	);
}
