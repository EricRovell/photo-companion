import { solarMeanAnomaly } from "./utils";
import { declination, eclipticLongitude, rightAscension } from "../utils";
import type { SunCoordinates } from "./types";

/**
 * Calculates the Sun coordinates.
 */
export function calcSunCoordinates(julianDays: number): SunCoordinates {
	const M = solarMeanAnomaly(julianDays);
	const L = eclipticLongitude(M);

	return {
		declination: declination(L, 0),
		rightAscension: rightAscension(L, 0)
	};
}
