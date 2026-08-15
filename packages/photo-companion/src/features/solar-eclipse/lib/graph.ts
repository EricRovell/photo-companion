import { getSolarEclipseState } from "moon-sun-calc";

import type { LocalSolarEclipse, SolarEclipseState } from "moon-sun-calc";

import {
	TRACK_HALF_SPAN,
	TRACK_SEGMENTS,
	VIEW_ALTITUDE_RADIUS,
	VIEW_AZIMUTH_RADIUS
} from "../config";

import type { EclipseGraphPoint } from "../model/types";

export function getEclipseGraphPoint(state: SolarEclipseState): EclipseGraphPoint {
	return {
		x: state.moon.offset.azimuth,
		y: -state.moon.offset.altitude
	};
}

export function isEclipseGraphPointOutside(point: EclipseGraphPoint, radius: number): boolean {
	return Math.abs(point.x) - radius > VIEW_AZIMUTH_RADIUS
		|| Math.abs(point.y) - radius > VIEW_ALTITUDE_RADIUS;
}

export function getSolarEclipseTrack(
	event: LocalSolarEclipse,
	latitude: number,
	longitude: number
): string {
	const peak = event.peak.time.getTime();
	const start = peak - TRACK_HALF_SPAN;
	const duration = 2 * TRACK_HALF_SPAN;
	const points: string[] = [];

	for (let index = 0; index <= TRACK_SEGMENTS; index += 1) {
		const state = getSolarEclipseState({
			instant: start + duration * index / TRACK_SEGMENTS,
			observer: { latitude, longitude }
		});

		const point = getEclipseGraphPoint(state);

		points.push(`${index === 0 ? "M" : "L"} ${point.x} ${point.y}`);
	}

	return points.join(" ");
}
