import { getDayStart } from "utils/date";
import { round, scale } from "utils/math";

import {ALTITUDE_MAX, ALTITUDE_MIN, DAY_MS, STEP_COUNT, X_RANGE, Y_RANGE } from "../consts";

import type { AltitudeGetter } from "../types";

export const createPathBuilder = (getAltitude: AltitudeGetter) => (date: DateLike, latitude: number, longitude: number) => {
	let timestamp = getDayStart(date);

	const timestampStart = timestamp;
	const timestampEnd = timestamp + DAY_MS;
	const stepValue = round(DAY_MS / STEP_COUNT);

	const coords = [];

	for (let i = 0; i <= STEP_COUNT; i++) {
		const { altitude } = getAltitude(timestamp, latitude, longitude, true);
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
