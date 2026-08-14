import { getDayStart } from "utils/date";
import { round, scale } from "utils/math";

import { ALTITUDE_MAX, ALTITUDE_MIN, DAY_MS, X_RANGE, Y_RANGE } from "../consts";

import type { AltitudeGetter } from "../types";

export const createObjectCoordsGetter = (getAltitude: AltitudeGetter) => (date: DateLike, latitude: number, longitude: number) => {
	if (typeof date === "number") {
		date = new Date(date);
	}

	const { apparentAltitude } = getAltitude({
		instant: date,
		observer: { latitude, longitude }
	});

	const timeStart = getDayStart(date);
	const timeEnd = timeStart + DAY_MS;

	const y = round(scale(apparentAltitude, ALTITUDE_MIN, ALTITUDE_MAX, -Y_RANGE / 2, Y_RANGE / 2), 2);
	const x = scale(date.getTime(), timeStart, timeEnd, 0, X_RANGE);

	return {
		x: round(x, 2),
		y: round(y, 2)
	};
};
