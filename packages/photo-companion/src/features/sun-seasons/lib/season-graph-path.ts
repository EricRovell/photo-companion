import { SEASON_GRAPH } from "../config";
import { getDeclination, getSeasonGraphPoint } from "./season-graph-points";

import type { SeasonGraphPoint, SeasonGraphRange } from "../types";

export function getSeasonCurve(range: SeasonGraphRange): SeasonGraphPoint[] {
	return Array.from({ length: SEASON_GRAPH.SAMPLE_COUNT + 1 }, (_, index) => {
		const timestamp = range.start
			+ (range.end - range.start) * index / SEASON_GRAPH.SAMPLE_COUNT;

		return getSeasonGraphPoint(timestamp, getDeclination(timestamp), range);
	});
}

export function getSeasonGraphPath(points: SeasonGraphPoint[]): string {
	return points
		.map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
}

export function getSeasonAreaPath(curvePath: string, centerY: number): string {
	return (
		`${curvePath} L ${SEASON_GRAPH.WIDTH - SEASON_GRAPH.RIGHT} ${centerY}` +
		` L ${SEASON_GRAPH.LEFT} ${centerY} Z`
	);
}
