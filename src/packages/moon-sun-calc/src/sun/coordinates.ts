import { solarMeanAnomaly } from "./utils";
import { declination, eclipticLongitude, rightAscension } from "../utils";
import type { SunCoordinates } from "../types";

/**
 * Calculates the Sun coordinates.
 */
export function calcSunCoordinates(julianDays: number): SunCoordinates {
	const M = solarMeanAnomaly(julianDays);
	const L = eclipticLongitude(M);

	return {
		dec: declination(L, 0),
		ra: rightAscension(L, 0)
	};
}
