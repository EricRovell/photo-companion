import { SEASON_GRAPH } from "../../../config";

import type { SeasonGraphPoint } from "../../../types";

import styles from "./season-graph-selection.module.css";

interface Props {
	dateLabel: string;
	point: SeasonGraphPoint;
}

export function SeasonGraphSelection(props: Props) {
	const labelAnchor = () => {
		if (props.point.x < SEASON_GRAPH.LABEL_EDGE_INSET) {
			return "start";
		}

		if (props.point.x > SEASON_GRAPH.WIDTH - SEASON_GRAPH.LABEL_EDGE_INSET) {
			return "end";
		}

		return "middle";
	};

	const labelOffset = () => {
		if (labelAnchor() === "start") {
			return 8;
		}

		return labelAnchor() === "end" ? -8 : 0;
	};

	return (
		<g
			aria-hidden="true"
			data-selected-date
			transform={`translate(${props.point.x} 0)`}
		>
			<line
				class={styles["selected-guide"]}
				x1="0"
				x2="0"
				y1={SEASON_GRAPH.TOP}
				y2={SEASON_GRAPH.HEIGHT - SEASON_GRAPH.BOTTOM}
			/>
			<g transform={`translate(0 ${props.point.y})`}>
				<circle class={styles["selected-halo"]} cx="0" cy="0" r="11" />
				<circle class={styles["selected-marker"]} cx="0" cy="0" r="5.5" />
			</g>
			<text
				class={styles["selected-label"]}
				data-selected-label
				text-anchor={labelAnchor()}
				x={labelOffset()}
				y="17"
			>
				{props.dateLabel}
			</text>
		</g>
	);
}
