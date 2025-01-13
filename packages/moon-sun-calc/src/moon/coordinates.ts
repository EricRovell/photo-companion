import { RAD } from "../consts";
import { declination, rightAscension } from "../utils";

import type { MoonCoordinates } from "./types";

/**
 * Calculates the geocentric ecliptic coordinates of the moon from the number of days.
 */
export function calcMoonCoordinates(days: number): MoonCoordinates {
	const eclipticLongitude = RAD * (218.316 + 13.176396 * days);
	const meanAnomaly = RAD * (134.963 + 13.064993 * days);
	const meanDistance = RAD * (93.272 + 13.229350 * days);
	const longitude = eclipticLongitude + RAD * 6.289 * Math.sin(meanAnomaly);
	const latitude = RAD * 5.128 * Math.sin(meanDistance);
	const distanceToTheMoonInKm = 385001 - 20905 * Math.cos(meanAnomaly);

	return {
		declination: declination(longitude, latitude),
		distance: distanceToTheMoonInKm,
		rightAscension: rightAscension(longitude, latitude)
	};
}
