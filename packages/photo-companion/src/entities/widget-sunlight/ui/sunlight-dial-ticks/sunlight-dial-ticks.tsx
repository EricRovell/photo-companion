import { For } from "solid-js";

import { SUNLIGHT_WIDGET_CONFIG } from "../../config";
import { getSunlightDialPoint } from "../../lib";

import type { SunlightTick } from "../../types";

import styles from "./sunlight-dial-ticks.module.css";

interface Props {
	ticks: SunlightTick[];
}

const DIAL = SUNLIGHT_WIDGET_CONFIG.dial;

export function SunlightDialTicks(props: Props) {
	return (
		<g>
			<For each={props.ticks}>
				{tick => (
					<line
						class={tick.major ? styles.major : styles.tick}
						x1={getSunlightDialPoint(tick.progress, tick.major ? DIAL.majorTickRadius : DIAL.tickRadius).x}
						x2={getSunlightDialPoint(tick.progress, DIAL.tickRadiusOuter).x}
						y1={getSunlightDialPoint(tick.progress, tick.major ? DIAL.majorTickRadius : DIAL.tickRadius).y}
						y2={getSunlightDialPoint(tick.progress, DIAL.tickRadiusOuter).y}
					/>
				)}
			</For>
			<For each={props.ticks.filter(tick => tick.major)}>
				{tick => (
					<text
						class={styles.label}
						x={getSunlightDialPoint(tick.progress, DIAL.labelRadius).x}
						y={getSunlightDialPoint(tick.progress, DIAL.labelRadius).y}
					>
						{String(new Date(tick.timestamp).getHours()).padStart(2, "0")}
					</text>
				)}
			</For>
		</g>
	);
}
