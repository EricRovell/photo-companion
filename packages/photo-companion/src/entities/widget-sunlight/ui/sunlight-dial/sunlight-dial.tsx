import { SUNLIGHT_WIDGET_CONFIG } from "../../config";
import { SunlightDialEvents } from "../sunlight-dial-events/sunlight-dial-events";
import { SunlightDialMarker } from "../sunlight-dial-marker/sunlight-dial-marker";
import { SunlightDialTicks } from "../sunlight-dial-ticks/sunlight-dial-ticks";
import { SunlightDialTrack } from "../sunlight-dial-track/sunlight-dial-track";

import type { SunlightDay, SunlightMarker, SunlightPhase, SunlightTick } from "../../types";

import styles from "./sunlight-dial.module.css";

interface Props {
	ariaLabel: string;
	day: SunlightDay;
	formatTime: (date: number) => string;
	markerLabel: (type: SunlightMarker["type"], timestamp: number) => string;
	phase: SunlightPhase;
	phaseLabel: (phase: SunlightPhase) => string;
	progress: number;
	ticks: SunlightTick[];
}

const DIAL = SUNLIGHT_WIDGET_CONFIG.dial;

export function SunlightDial(props: Props) {
	const progress = (timestamp: number) => (timestamp - props.day.start) / (props.day.end - props.day.start);

	return (
		<svg
			aria-label={props.ariaLabel}
			class={styles.dial}
			role="img"
			viewBox={`0 0 ${DIAL.viewBoxSize} ${DIAL.viewBoxSize}`}
		>
			<circle
				class={styles.horizon}
				cx={DIAL.center}
				cy={DIAL.center}
				r={DIAL.horizonRadius}
			/>
			<SunlightDialTicks ticks={props.ticks} />
			<SunlightDialTrack
				formatTime={props.formatTime}
				intervals={props.day.intervals}
				phaseLabel={props.phaseLabel}
				progress={progress}
			/>
			<SunlightDialEvents
				markerLabel={props.markerLabel}
				markers={props.day.markers}
				progress={progress}
			/>
			<SunlightDialMarker
				phase={props.phase}
				progress={props.progress}
			/>
		</svg>
	);
}
