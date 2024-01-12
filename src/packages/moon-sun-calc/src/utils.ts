import { DAY_MS, J1970, J2000, RAD, EARTH_OBLIQUITY, J0 } from "./consts";
import type { SunCoordinates } from "./types";

// Date

/**
 * Converts date from Julian calendar and returns a date as timestamp.
 */
export function fromJulianDay(julianDay: number): number {
	return (julianDay - J1970) * DAY_MS;
}

/**
 * Counts the number of days for a dateValue since 2000.
 */
export function toDays(timestamp: number): number {
	return ((timestamp / DAY_MS) + J1970) - J2000;
}

// Position

/**
 * Calculates the right ascension.
 */
export function rightAscension(l: number, b: number): number {
	return Math.atan2(Math.sin(l) * Math.cos(EARTH_OBLIQUITY) - Math.tan(b) * Math.sin(EARTH_OBLIQUITY), Math.cos(l));
}

/**
 * Calculates the declination.
 */
export function declination(l: number, b: number): number {
	return Math.asin(Math.sin(b) * Math.cos(EARTH_OBLIQUITY) + Math.cos(b) * Math.sin(EARTH_OBLIQUITY) * Math.sin(l));
}

/**
* Calculates the azimuth in radians.
*/
export function azimuthCalc(siderialTime: number, phi: number, sunDeclination: number): number {
	return Math.atan2(Math.sin(siderialTime), Math.cos(siderialTime) * Math.sin(phi) - Math.tan(sunDeclination) * Math.cos(phi)) + Math.PI;
}

/**
* Calculates the  altitude.
*/
export function altitudeCalc(siderialTime: number, phi: number, sunDeclination: number): number {
	return Math.asin(Math.sin(phi) * Math.sin(sunDeclination) + Math.cos(phi) * Math.cos(sunDeclination) * Math.cos(siderialTime));
}

/**
 * Calculated the sidereal time.
 */
export function siderealTime(d: number, lw: number): number {
	return RAD * (280.16 + 360.9856235 * d) - lw;
}

/**
* Calculates the astro refraction.
*/
export function astroRefraction(h: number): number {
	// the following formula works for positive altitudes only.
	if (h < 0) { 
		h = 0;
	}
	
	// if h = -0.08901179 a div/0 would occur.

	// formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
	// 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
	return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
}

/**
* Adds hours to a date.
*/
export function hoursLater(dateValue: number, hours: number): number {
	return dateValue + hours * DAY_MS / 24;
}

/**
 * Julian cycle
 * lw is {rad * -lng}
 */
export function julianCycle(daysCount: number, lw: number): number {
	return Math.round(daysCount - J0 - lw / (2 * Math.PI));
}

/**
 * Approx transit
 * lw is {rad * -lng}
 */
export function approxTransit(hourAngle: number, lw: number, julianCycle: number): number {
	return J0 + (hourAngle + lw) / (2 * Math.PI) + julianCycle;
}

/**
* Calculates the solar transit in Julian.
*/
export function solarTransitJ(approxTransit: number, solarMeanAnomal: number, eclipticLongitude: number): number {
	return J2000 + approxTransit + 0.0053 * Math.sin(solarMeanAnomal) - 0.0069 * Math.sin(2 * eclipticLongitude);
}

/**
* Calculates the hour angle.
*
* Note:phi = rad * lat;
*/
function hourAngle(zeroHeight: number, phi: number, declination: number): number {
	return Math.acos((Math.sin(zeroHeight) - Math.sin(phi) * Math.sin(declination)) / (Math.cos(phi) * Math.cos(declination)));
}

/**
* Calculates the observer angle from the observer height (in meters) relative to the horizon.
*/
export function observerAngle(height: number): number {
	return -2.076 * Math.sqrt(height) / 60;
}

/**
* returns set time for the given sun altitude
* @param {number} lw - rad * -lng
* @param {number} phi -  rad * lat;
*/
export function getSetJ(
	heightAtZero: number,
	lw: number,
	phi: number,
	declination: number,
	julianCycle: number,
	solarMeanAnomaly: number,
	ellipticLongitude: number
): number {
	const w = hourAngle(heightAtZero, phi, declination);
	const a = approxTransit(w, lw, julianCycle);
	return solarTransitJ(a, solarMeanAnomaly, ellipticLongitude);
}

/**
 * Calculates the solar mean anomaly.
 */
export function solarMeanAnomaly(d: number): number {
	return RAD * (357.5291 + 0.98560028 * d);
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
