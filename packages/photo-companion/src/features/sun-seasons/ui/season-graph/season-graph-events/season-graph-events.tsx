import { For } from "solid-js";

import { SEASON_GRAPH } from "../../../config";

import type { SeasonGraphEventPoint } from "../../../types";

import styles from "./season-graph-events.module.css";

export function SeasonGraphEvents(props: { events: SeasonGraphEventPoint[] }) {
	return (
		<For each={props.events}>
			{({ event, point }) => (
				<g aria-hidden="true" data-season-event>
					<line
						class={styles["event-guide"]}
						x1={point.x}
						x2={point.x}
						y1={SEASON_GRAPH.TOP}
						y2={SEASON_GRAPH.HEIGHT - SEASON_GRAPH.BOTTOM}
					/>
					<circle
						class={styles["event-marker"]}
						cx={point.x}
						cy={point.y}
						data-kind={event.name.startsWith("EQUINOX") ? "equinox" : "solstice"}
						r="5"
					/>
					<text class={styles["event-label"]} x={point.x} y={SEASON_GRAPH.HEIGHT - SEASON_GRAPH.BOTTOM + 24}>
						{String(event.time.getMonth() + 1).padStart(2, "0")}
					</text>
				</g>
			)}
		</For>
	);
}
