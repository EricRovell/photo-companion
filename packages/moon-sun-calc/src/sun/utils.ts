import { DAY_MS, J0, J1970, J2000, RAD } from "../consts";

/**
 * Approx transit
 * lw is {rad * -lng}
 */
export function approxTransit(hourAngle: number, lw: number, julianCycle: number): number {
	return J0 + (hourAngle + lw) / (2 * Math.PI) + julianCycle;
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
 * Converts date from Julian calendar and returns a date as timestamp.
 */
export function fromJulianDay(julianDay: number): number {
	return (julianDay - J1970) * DAY_MS;
}

/**
 * Julian cycle
 * lw is {rad * -lng}
 */
export function julianCycle(daysCount: number, lw: number): number {
	return Math.round(daysCount - J0 - lw / (2 * Math.PI));
}

/**
* Calculates the observer angle from the observer height (in meters) relative to the horizon.
*/
export function observerAngle(height: number): number {
	return -2.076 * Math.sqrt(height) / 60;
}

/**
 * Calculates the solar mean anomaly.
 */
export function solarMeanAnomaly(d: number): number {
	return RAD * (357.5291 + 0.98560028 * d);
}

/**
* Calculates the solar transit in Julian.
*/
export function solarTransitJ(approxTransit: number, solarMeanAnomal: number, eclipticLongitude: number): number {
	return J2000 + approxTransit + 0.0053 * Math.sin(solarMeanAnomal) - 0.0069 * Math.sin(2 * eclipticLongitude);
}
