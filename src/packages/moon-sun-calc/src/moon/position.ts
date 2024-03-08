import { isLatitude, isLongitude } from "@shared/utils";

import { calcMoonCoordinates } from "./coordinates";
import { RAD, DEGREES } from "../consts";
import { astroRefraction } from "./utils";
import { siderealTime, altitudeCalc, toDays, azimuthCalc } from "../utils";
import type { MoonPosition } from "../types";

/**
 * Calculates moon position for a given date and latitude/longitude.
 */
export function getMoonPosition(dateValue: Date | number, latitude: number, longitude: number): MoonPosition {
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
	const days = toDays(dateValue);
	const coords = calcMoonCoordinates(days);
	const H = siderealTime(days, lw) - coords.ra;
	let altitude = altitudeCalc(H, phi, coords.dec);

	// altitude correction for refraction
	altitude += astroRefraction(altitude);

	// formula 14.1 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
	const pa = Math.atan2(Math.sin(H), Math.tan(phi) * Math.cos(coords.dec) - Math.sin(coords.dec) * Math.cos(H));
	const azimuth = azimuthCalc(H, phi, coords.dec);

	return {
		azimuth,
		altitude,
		azimuthDegrees: DEGREES * azimuth,
		altitudeDegrees: DEGREES * altitude,
		distance: coords.dist,
		parallacticAngle: pa,
		parallacticAngleDegrees: DEGREES * pa
	};
}
