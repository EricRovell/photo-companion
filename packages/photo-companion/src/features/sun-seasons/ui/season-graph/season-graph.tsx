import { createMemo, createUniqueId } from "solid-js";

import { useTranslation } from "~/features/translation";
import { createTweened } from "~/shared/primitives";

import { SEASON_GRAPH } from "../../config";
import {
	getSeasonAreaPath,
	getSeasonCurve,
	getSeasonEventPoints,
	getSeasonGraphPath,
	getSeasonGraphRange,
	getSeasonGraphY,
	getSeasonProgress,
	getSelectedPoint
} from "../../lib";
import { SeasonGraphAxis } from "./season-graph-axis";
import { SeasonGraphEvents } from "./season-graph-events";
import { SeasonGraphSelection } from "./season-graph-selection";

import type { SeasonGraphProps } from "../../types";

import styles from "./season-graph.module.css";

export function SeasonGraph(props: SeasonGraphProps) {
	const { format, t } = useTranslation();
	const gradientId = createUniqueId();
	const year = createMemo(() => props.datetime.getFullYear());
	const range = createMemo(() => getSeasonGraphRange(year()));
	const centerY = getSeasonGraphY(0);
	const curvePath = createMemo(() => getSeasonGraphPath(getSeasonCurve(range())));
	const areaPath = createMemo(() => getSeasonAreaPath(curvePath(), centerY));
	const selectedProgress = createTweened(() => getSeasonProgress(props.datetime, range()));
	const selected = createMemo(() => getSelectedPoint(selectedProgress(), range()));
	const eventPoints = createMemo(() => getSeasonEventPoints(props.events, range()));

	return (
		<figure class={styles.figure}>
			<svg
				aria-labelledby={`${gradientId}-title`}
				class={styles.graph}
				role="img"
				viewBox={`0 0 ${SEASON_GRAPH.WIDTH} ${SEASON_GRAPH.HEIGHT}`}
			>
				<title id={`${gradientId}-title`}>
					{t().SEASONS.TITLE}: {format().dateShort(props.datetime)}
				</title>
				<defs>
					<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
						<stop class={styles["area-north"]} offset="0" />
						<stop class={styles["area-center"]} offset="0.5" />
						<stop class={styles["area-south"]} offset="1" />
					</linearGradient>
				</defs>

				<SeasonGraphAxis
					centerY={centerY}
					declinationLabel={t().SEASONS.AXIS_DECLINATION}
					monthLabel={t().SEASONS.AXIS_MONTH}
				/>
				<path aria-hidden="true" class={styles.area} d={areaPath()} fill={`url(#${gradientId})`} />
				<path aria-hidden="true" class={styles.curve} d={curvePath()} data-season-curve />
				<SeasonGraphEvents events={eventPoints()} />
				<SeasonGraphSelection
					dateLabel={format().dateShort(props.datetime)}
					point={selected()}
				/>
			</svg>
		</figure>
	);
}
