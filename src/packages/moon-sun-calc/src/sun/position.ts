import { isLatitude, isLongitude } from "@shared/utils";

import { RAD, DEGREES } from "../consts";
import { siderealTime, toDays, azimuthCalc, altitudeCalc } from "../utils";
import { calcSunCoordinates } from "./coordinates";
import type { SunPosition } from "../types";

/**
 * Calculates the Sun position for a given date and geoposition coordinates.
*/
export function getSunPosition(dateValue: Date | number, latitude: number, longitude: number): SunPosition {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	if (dateValue instanceof Date) {
		dateValue = dateValue.valueOf();
	}

	const lw = RAD * -longitude;
	const phi = RAD * latitude;
	const d = toDays(dateValue);
	const c = calcSunCoordinates(d);
	const H = siderealTime(d, lw) - c.ra;
	const azimuth = azimuthCalc(H, phi, c.dec);
	const altitude = altitudeCalc(H, phi, c.dec);

	return {
		azimuth,
		altitude,
		zenith: (90 * Math.PI/180) - altitude,
		azimuthDegrees: DEGREES * azimuth,
		altitudeDegrees: DEGREES * altitude,
		zenithDegrees: 90 - (DEGREES * altitude),
		declination: c.dec
	};
}
