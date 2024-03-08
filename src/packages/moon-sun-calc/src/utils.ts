import { DAY_MS, J1970, J2000, RAD, EARTH_OBLIQUITY } from "./consts";

/**
* Calculates the altitude.
*/
export function altitudeCalc(siderialTime: number, phi: number, sunDeclination: number): number {
	return Math.asin(Math.sin(phi) * Math.sin(sunDeclination) + Math.cos(phi) * Math.cos(sunDeclination) * Math.cos(siderialTime));
}

/**
* Calculates the azimuth in radians.
*/
export function azimuthCalc(siderialTime: number, phi: number, sunDeclination: number): number {
	return Math.atan2(Math.sin(siderialTime), Math.cos(siderialTime) * Math.sin(phi) - Math.tan(sunDeclination) * Math.cos(phi)) + Math.PI;
}

/**
 * Calculates the declination.
 */
export function declination(l: number, b: number): number {
	return Math.asin(Math.sin(b) * Math.cos(EARTH_OBLIQUITY) + Math.cos(b) * Math.sin(EARTH_OBLIQUITY) * Math.sin(l));
}

/**
* Calculates the ecliptic longitude.
*/
export function eclipticLongitude(M: number): number {
	// equation of center
	const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));

	// perihelion of the Earth
	const P = RAD * 102.9372;

	return M + C + P + Math.PI;
}

/**
 * Calculates the right ascension.
 */
export function rightAscension(l: number, b: number): number {
	return Math.atan2(Math.sin(l) * Math.cos(EARTH_OBLIQUITY) - Math.tan(b) * Math.sin(EARTH_OBLIQUITY), Math.cos(l));
}

/**
 * Calculated the sidereal time.
 */
export function siderealTime(d: number, lw: number): number {
	return RAD * (280.16 + 360.9856235 * d) - lw;
}

/**
 * Counts the number of days for a dateValue since 2000.
 */
export function toDays(timestamp: number): number {
	return ((timestamp / DAY_MS) + J1970) - J2000;
}
