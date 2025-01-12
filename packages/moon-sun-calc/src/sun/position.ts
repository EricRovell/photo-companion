import { isLatitude, isLongitude } from "utils/validators";

import { RAD } from "../consts";
import { altitudeCalc, azimuthCalc, siderealTime, toDays, toDegrees } from "../utils";
import { calcSunCoordinates } from "./coordinates";

import type { SunPosition } from "./types";

/**
 * Calculates the Sun position for a given date and geoposition coordinates.
*/
export function getSunPosition(date: DateLike, latitude: number, longitude: number, degrees = false): SunPosition {
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
	const H = siderealTime(d, lw) - c.rightAscension;
	const azimuth = azimuthCalc(H, phi, c.declination);
	const altitude = altitudeCalc(H, phi, c.declination);

	return {
		altitude: toDegrees(altitude, degrees),
		azimuth: toDegrees(azimuth, degrees),
		declination: toDegrees(c.declination, degrees),
		zenith: toDegrees(Math.PI / 2, degrees) - toDegrees(altitude, degrees)
	};
}
