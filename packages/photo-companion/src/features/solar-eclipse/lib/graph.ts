import { getSolarEclipseState } from "moon-sun-calc";

import type { LocalSolarEclipse, SolarEclipseState } from "moon-sun-calc";

import { GRAPH_CONFIG } from "../config";

import type { EclipseGraphPoint } from "../model/types";

export function getEclipseGraphPoint(state: SolarEclipseState): EclipseGraphPoint {
	return {
		x: state.moon.offset.azimuth,
		y: -state.moon.offset.altitude
	};
}

export function isEclipseGraphPointOutside(point: EclipseGraphPoint, radius: number): boolean {
	return Math.abs(point.x) - radius > GRAPH_CONFIG.viewAzimuthRadius
		|| Math.abs(point.y) - radius > GRAPH_CONFIG.viewAltitudeRadius;
}

export function getSolarEclipseTrack(
	event: LocalSolarEclipse,
	latitude: number,
	longitude: number
): string {
	const peak = event.peak.time.getTime();
	const start = peak - GRAPH_CONFIG.trackHalfSpan;
	const duration = 2 * GRAPH_CONFIG.trackHalfSpan;
	const points: string[] = [];

	for (let index = 0; index <= GRAPH_CONFIG.trackSegments; index += 1) {
		const state = getSolarEclipseState({
			instant: start + duration * index / GRAPH_CONFIG.trackSegments,
			observer: { latitude, longitude }
		});

		const point = getEclipseGraphPoint(state);

		points.push(`${index === 0 ? "M" : "L"} ${point.x} ${point.y}`);
	}

	return points.join(" ");
}
