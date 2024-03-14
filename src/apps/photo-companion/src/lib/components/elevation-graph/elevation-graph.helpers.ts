import { dateFrom } from "utils/date";
import { round, scale } from "utils/math";

import {
	ALTITUDE_MAX,
	ALTITUDE_MIN,
	DAY_MS,
	STEP_COUNT,
	X_RANGE,
	Y_RANGE,
	TICK_COUNT,
	Y_MAX,
	Y_RANGE_TICKS
} from "./elevation-graph.consts";
import type { AltitudeGetter, Tick } from "./elevation-graph.types";

function getDayStart(date: Date | number) {
	return dateFrom(date, {
		hours: 0,
		minutes: 0,
		seconds: 0
	}).getTime();
}

export const createPathBuilder = (getAltitude: AltitudeGetter) => (date: Date | number, latitude: number, longitude: number) => {
	let timestamp = getDayStart(date);

	const timestampStart = timestamp;
	const timestampEnd = timestamp + DAY_MS;
	const stepValue = round(DAY_MS / STEP_COUNT);
	
	const coords = [];

	for (let i = 0; i <= STEP_COUNT; i++) {
		const altitude = getAltitude(timestamp, latitude, longitude).altitudeDegrees;
		const y = round(altitude, 2);

		const x = scale(timestamp, timestampStart, timestampEnd, 0, X_RANGE);

		coords.push(x, y);

		timestamp += stepValue;
	}

	// scale Y values based on range
	for (let i = 1; i < coords.length; i += 2) {
		coords[i] = round(scale(coords[i], ALTITUDE_MIN, ALTITUDE_MAX, -Y_RANGE / 2, Y_RANGE / 2), 2);
	}

	return `M ${coords.join(" ")}`;
};

export const createObjectCoordsGetter = (getAltitude: AltitudeGetter) => (date: Date | number, latitude: number, longitude: number) => {
	if (typeof date === "number") {
		date = new Date(date);
	}
	
	const altitude = getAltitude(date, latitude, longitude).altitudeDegrees;

	const timeStart = getDayStart(date);
	const timeEnd = timeStart + DAY_MS;

	const y = round(scale(altitude, ALTITUDE_MIN, ALTITUDE_MAX, -Y_RANGE / 2, Y_RANGE / 2), 2);
	const x = scale(date.getTime(), timeStart, timeEnd, 0, X_RANGE);

	return {
		x: round(x, 2),
		y: round(y, 2)
	};
};

export function getTicks() {
	const ticks: Tick[] = [];
	const xStep = round(X_RANGE / (TICK_COUNT + 1), 2);
	const y = Y_MAX + Y_RANGE_TICKS / 2;

	for (let i = 1; i <= TICK_COUNT; i++) {
		ticks.push({
			text: i < 10 ? `0${i}` : i.toString(),
			x: i * xStep,
			y
		});
	}

	return ticks;
}
