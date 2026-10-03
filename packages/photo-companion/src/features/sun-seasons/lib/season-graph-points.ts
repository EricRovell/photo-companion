import { getSunPosition } from "moon-sun-calc";
import { scale } from "utils/math";

import type { SeasonEvent } from "moon-sun-calc";

import { EQUATOR_OBSERVER, SEASON_GRAPH } from "../config";

import type {
	SeasonGraphEventPoint,
	SeasonGraphPoint,
	SeasonGraphRange
} from "../types";

export function getDeclination(timestamp: number): number {
	return getSunPosition({ instant: timestamp, observer: EQUATOR_OBSERVER }).declination;
}

export function getSeasonGraphY(declination: number): number {
	return scale(
		declination,
		-SEASON_GRAPH.DECLINATION_LIMIT,
		SEASON_GRAPH.DECLINATION_LIMIT,
		SEASON_GRAPH.HEIGHT - SEASON_GRAPH.BOTTOM,
		SEASON_GRAPH.TOP
	);
}

export function getSeasonGraphPoint(
	timestamp: number,
	declination: number,
	range: SeasonGraphRange
): SeasonGraphPoint {
	return {
		x: scale(timestamp, range.start, range.end, SEASON_GRAPH.LEFT, SEASON_GRAPH.WIDTH - SEASON_GRAPH.RIGHT),
		y: getSeasonGraphY(declination)
	};
}

export function getSelectedPoint(progress: number, range: SeasonGraphRange): SeasonGraphPoint {
	const timestamp = scale(progress, 0, 1, range.start, range.end);

	return getSeasonGraphPoint(timestamp, getDeclination(timestamp), range);
}

export function getSeasonEventPoints(
	events: SeasonEvent[],
	range: SeasonGraphRange
): SeasonGraphEventPoint[] {
	return events.map((event) => {
		const timestamp = event.time.getTime();

		return {
			event,
			point: getSeasonGraphPoint(timestamp, getDeclination(timestamp), range)
		};
	});
}
