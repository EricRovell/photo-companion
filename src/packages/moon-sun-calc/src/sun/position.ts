import { isLatitude, isLongitude } from "utils/validators";

import { RAD, DEGREES } from "../consts";
import { siderealTime, toDays, azimuthCalc, altitudeCalc } from "../utils";
import { calcSunCoordinates } from "./coordinates";
import type { SunPosition } from "../types";

/**
 * Calculates the Sun position for a given date and geoposition coordinates.
*/
export function getSunPosition(date: DateLike, latitude: number, longitude: number): SunPosition {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	if (date instanceof Date) {
		date = date.valueOf();
	}

	const lw = RAD * -longitude;
	const phi = RAD * latitude;
	const d = toDays(date);
	const c = calcSunCoordinates(d);
	const H = siderealTime(d, lw) - c.ra;
	const azimuth = azimuthCalc(H, phi, c.dec);
	const altitude = altitudeCalc(H, phi, c.dec);

	return {
		altitude,
		altitudeDegrees: DEGREES * altitude,
		azimuth,
		azimuthDegrees: DEGREES * azimuth,
		declination: c.dec,
		declinationDegrees: c.dec * DEGREES,
		zenith: (90 * Math.PI/180) - altitude,
		zenithDegrees: 90 - (DEGREES * altitude)
	};
}
