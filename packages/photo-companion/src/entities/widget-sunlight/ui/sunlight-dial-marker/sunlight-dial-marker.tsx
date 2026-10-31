import { circular, createTweened } from "~/shared/primitives";

import { SUNLIGHT_WIDGET_CONFIG } from "../../config";

import type { SunlightPhase } from "../../types";

import styles from "./sunlight-dial-marker.module.css";

interface Props {
	phase: SunlightPhase;
	progress: number;
}

const DIAL = SUNLIGHT_WIDGET_CONFIG.dial;
const MARKER_PATH = [
	`M ${DIAL.center - DIAL.markerWidth / 2} ${DIAL.center + DIAL.horizonRadius}`,
	`L ${DIAL.center} ${DIAL.center + DIAL.horizonRadius - DIAL.markerHeight}`,
	`L ${DIAL.center + DIAL.markerWidth / 2} ${DIAL.center + DIAL.horizonRadius}`,
	"Z"
].join(" ");

export function SunlightDialMarker(props: Props) {
	const position = createTweened(() => props.progress, {
		duration: SUNLIGHT_WIDGET_CONFIG.animation.transitionDuration,
		interpolate: circular(1)
	});

	return (
		<path
			aria-hidden="true"
			class={styles.marker}
			d={MARKER_PATH}
			data-marker="current"
			data-phase={props.phase}
			transform={`rotate(${position() * 360} ${DIAL.center} ${DIAL.center})`}
		/>
	);
}
