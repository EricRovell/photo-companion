import { ALTITUDE_WIDGET_CONFIG } from "../config";

import type { AltitudePoint, AltitudeRange } from "../types";

const { altitudePadding } = ALTITUDE_WIDGET_CONFIG.axis;

export function getAltitudeRange(points: AltitudePoint[]): AltitudeRange {
	let min = Infinity;
	let max = -Infinity;

	for (const point of points) {
		min = Math.min(min, point.altitude);
		max = Math.max(max, point.altitude);
	}

	return {
		max: (points.length > 0 ? max : 0) + altitudePadding,
		min: (points.length > 0 ? min : 0) - altitudePadding
	};
}
