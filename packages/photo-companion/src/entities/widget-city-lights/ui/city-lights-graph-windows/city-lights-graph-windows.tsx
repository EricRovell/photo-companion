import { Index } from "solid-js";

import type { CityLightsNightEvent } from "../../types";

import styles from "./city-lights-graph-windows.module.css";

interface Props {
	windows: CityLightsNightEvent[];
}

export function CityLightsGraphWindows(props: Props) {
	return (
		<Index each={props.windows}>
			{event => (
				<div
					class={styles.window}
					data-uncertainty-minutes={event().uncertaintyMinutes}
					style={{
						left: `${event().windowStart}%`,
						width: `${event().windowEnd - event().windowStart}%`
					}}
				/>
			)}
		</Index>
	);
}
