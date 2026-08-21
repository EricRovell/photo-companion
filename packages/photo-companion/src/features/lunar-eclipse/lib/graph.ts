import { getLunarEclipseState } from "moon-sun-calc";

import type { LocalLunarEclipse, LunarEclipseState } from "moon-sun-calc";

import { GRAPH_CONFIG } from "../config";

import type { EclipseGraphPoint } from "../types";

export function getLunarEclipseGraphPoint(state: LunarEclipseState): EclipseGraphPoint {
	return {
		x: state.moon.offset.azimuth,
		y: -state.moon.offset.altitude
	};
}

export function getLunarEclipseTrack(
	event: LocalLunarEclipse,
	latitude: number,
	longitude: number
): string {
	const peak = event.peak.time.getTime();
	const start = peak - GRAPH_CONFIG.trackHalfSpan;
	const duration = 2 * GRAPH_CONFIG.trackHalfSpan;
	const points: string[] = [];

	for (let index = 0; index <= GRAPH_CONFIG.trackSegments; index += 1) {
		const state = getLunarEclipseState({
			instant: start + duration * index / GRAPH_CONFIG.trackSegments,
			observer: { latitude, longitude }
		});

		const point = getLunarEclipseGraphPoint(state);

		points.push(`${index === 0 ? "M" : "L"} ${point.x} ${point.y}`);
	}

	return points.join(" ");
}
