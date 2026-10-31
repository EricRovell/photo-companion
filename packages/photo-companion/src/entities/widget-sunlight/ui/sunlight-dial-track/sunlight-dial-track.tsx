import { For } from "solid-js";

import { SUNLIGHT_WIDGET_CONFIG } from "../../config";
import { buildSunlightArc, getSunlightDialPoint } from "../../lib";

import type { SunlightInterval, SunlightPhase } from "../../types";

import styles from "./sunlight-dial-track.module.css";

interface Props {
	formatTime: (timestamp: number) => string;
	intervals: SunlightInterval[];
	phaseLabel: (phase: SunlightPhase) => string;
	progress: (timestamp: number) => number;
}

const DIAL = SUNLIGHT_WIDGET_CONFIG.dial;

export function SunlightDialTrack(props: Props) {
	return (
		<g>
			<For
				each={props.intervals.filter(interval => interval.phase === "night")}
			>
				{interval => (
					<path
						class={styles["night-outline"]}
						d={buildSunlightArc(props.progress(interval.start), props.progress(interval.end), DIAL.trackRadius)}
					/>
				)}
			</For>
			<For each={props.intervals}>
				{interval => (
					<path
						class={styles.segment}
						d={buildSunlightArc(props.progress(interval.start), props.progress(interval.end), DIAL.trackRadius)}
						data-phase={interval.phase}
					>
						<title>
							{`${props.phaseLabel(interval.phase)}: ${props.formatTime(interval.start)}–${props.formatTime(interval.end)}`}
						</title>
					</path>
				)}
			</For>
			<For each={props.intervals.slice(1)}>
				{interval => (
					<line
						class={styles["segment-divider"]}
						x1={getSunlightDialPoint(props.progress(interval.start), DIAL.trackRadius - DIAL.segmentDividerHalfLength).x}
						x2={getSunlightDialPoint(props.progress(interval.start), DIAL.trackRadius + DIAL.segmentDividerHalfLength).x}
						y1={getSunlightDialPoint(props.progress(interval.start), DIAL.trackRadius - DIAL.segmentDividerHalfLength).y}
						y2={getSunlightDialPoint(props.progress(interval.start), DIAL.trackRadius + DIAL.segmentDividerHalfLength).y}
					/>
				)}
			</For>
		</g>
	);
}
