import { SEASON_GRAPH } from "../../../config";

import styles from "./season-graph-axis.module.css";

interface Props {
	centerY: number;
	declinationLabel: string;
	monthLabel: string;
}

export function SeasonGraphAxis(props: Props) {
	const right = SEASON_GRAPH.WIDTH - SEASON_GRAPH.RIGHT;
	const bottom = SEASON_GRAPH.HEIGHT - SEASON_GRAPH.BOTTOM;
	const declinationLabelX = 10;

	return (
		<g aria-hidden="true">
			<line class={styles.axis} x1={SEASON_GRAPH.LEFT} x2={right} y1={SEASON_GRAPH.TOP} y2={SEASON_GRAPH.TOP} />
			<line class={styles.axis} x1={SEASON_GRAPH.LEFT} x2={right} y1={props.centerY} y2={props.centerY} />
			<line class={styles.axis} x1={SEASON_GRAPH.LEFT} x2={right} y1={bottom} y2={bottom} />
			<text class={styles["axis-label"]} x={SEASON_GRAPH.LEFT - 6} y={SEASON_GRAPH.TOP}>+23.4°</text>
			<text class={styles["axis-label"]} x={SEASON_GRAPH.LEFT - 6} y={props.centerY}>0°</text>
			<text class={styles["axis-label"]} x={SEASON_GRAPH.LEFT - 6} y={bottom}>−23.4°</text>
			<text
				class={styles["axis-title"]}
				transform={`rotate(-90 ${declinationLabelX} ${props.centerY})`}
				x={declinationLabelX}
				y={props.centerY}
			>
				{props.declinationLabel}
			</text>
			<text
				class={styles["axis-title"]}
				text-anchor="middle"
				x={SEASON_GRAPH.WIDTH / 2}
				y={SEASON_GRAPH.HEIGHT - 6}
			>
				{props.monthLabel}
			</text>
		</g>
	);
}
