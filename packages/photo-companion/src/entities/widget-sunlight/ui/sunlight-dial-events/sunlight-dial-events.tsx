import { For } from "solid-js";

import { SUNLIGHT_WIDGET_CONFIG } from "../../config";
import { getSunlightDialPoint } from "../../lib";

import type { SunlightMarker } from "../../types";

import styles from "./sunlight-dial-events.module.css";

interface Props {
	markerLabel: (type: SunlightMarker["type"], timestamp: number) => string;
	markers: SunlightMarker[];
	progress: (timestamp: number) => number;
}

const DIAL = SUNLIGHT_WIDGET_CONFIG.dial;

export function SunlightDialEvents(props: Props) {
	return (
		<g>
			<For each={props.markers}>
				{event => (
					<line
						class={styles.event}
						x1={getSunlightDialPoint(props.progress(event.timestamp), DIAL.trackRadius - DIAL.eventTickHalfLength).x}
						x2={getSunlightDialPoint(props.progress(event.timestamp), DIAL.trackRadius + DIAL.eventTickHalfLength).x}
						y1={getSunlightDialPoint(props.progress(event.timestamp), DIAL.trackRadius - DIAL.eventTickHalfLength).y}
						y2={getSunlightDialPoint(props.progress(event.timestamp), DIAL.trackRadius + DIAL.eventTickHalfLength).y}
					>
						<title>{props.markerLabel(event.type, event.timestamp)}</title>
					</line>
				)}
			</For>
		</g>
	);
}
