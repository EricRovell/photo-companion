import { isLatitude, isLongitude } from "utils/validators";

import { calcMoonCoordinates } from "./coordinates";
import { RAD } from "../consts";
import { astroRefraction } from "./utils";
import { siderealTime, altitudeCalc, toDays, azimuthCalc, toDegrees } from "../utils";
import type { MoonPosition } from "./types";

/**
 * Calculates moon position for a given date and geoposition.
 * The output angle values are in radians by default.
 */
export function getMoonPosition(dateValue: DateLike, latitude: number, longitude: number, degrees = false): MoonPosition {
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
	const H = siderealTime(days, lw) - coords.rightAscension;
	let altitude = altitudeCalc(H, phi, coords.declination);

	// altitude correction for refraction
	altitude += astroRefraction(altitude);

	// formula 14.1 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
	const pa = Math.atan2(Math.sin(H), Math.tan(phi) * Math.cos(coords.declination) - Math.sin(coords.declination) * Math.cos(H));
	const azimuth = azimuthCalc(H, phi, coords.declination);

	return {
		azimuth: toDegrees(azimuth, degrees),
		altitude: toDegrees(altitude, degrees),
		distance: coords.distance,
		parallacticAngle: toDegrees(pa, degrees)
	};
}
