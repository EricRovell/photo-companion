import { DEG2RAD, H2DEG, RAD2DEG } from "../consts";
import { getLocalSiderealTime } from "../utils/julian-day";
import { fmod360, fmod90 } from "../utils/math";

import type { CoordinatesGeographic, CoordinatesHorizontal, Degree, EquatorialCoordinates, JulianDay } from "../types";

/**
 * Equatorial right ascension from horizontal coordinates
 *
 * @param {JulianDay} jd The julian day
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {CoordinatesHorizontal} horCoords The horizontal coordinates of the target
 * @returns {Degree}
 */
export function getRightAscensionFromHorizontal (jd: JulianDay, horCoords: CoordinatesHorizontal, geoCoords: CoordinatesGeographic): Degree {
	const localSiderealTime: Degree = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG;

	const altitude = horCoords.altitude * DEG2RAD;
	const azimuth = horCoords.azimuth * DEG2RAD;
	const latitude = geoCoords.latitude * DEG2RAD;

	const y = Math.sin(azimuth);
	const x = Math.cos(azimuth) * Math.sin(latitude) + Math.tan(altitude) * Math.cos(latitude);
	const value: Degree = localSiderealTime - Math.atan2(y, x) * RAD2DEG;

	return fmod360(value);
}

/**
 * Equatorial declination from horizontal coordinates
 *
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {CoordinatesHorizontal} horCoords The horizontal coordinates of the target
 * @returns {Degree}
 */
export function getDeclinationFromHorizontal (horCoords: CoordinatesHorizontal, geoCoords: CoordinatesGeographic): Degree {
	const altitude = horCoords.altitude * DEG2RAD;
	const azimuth = horCoords.azimuth * DEG2RAD;
	const latitude = geoCoords.latitude * DEG2RAD;

	const value = Math.asin(Math.sin(latitude) * Math.sin(altitude) - Math.cos(latitude) * Math.cos(altitude) * Math.cos(azimuth));

	return fmod90(value * RAD2DEG);
}

/**
 * Transform horizontal coordinates to equatorial coordinates.
 *
 * @param {JulianDay} jd The julian day
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {CoordinatesHorizontal} horCoords The horizontal coordinates of the target
 * @returns {EquatorialCoordinates}
 */
export function transformHorizontalToEquatorial (jd: JulianDay, horCoords: CoordinatesHorizontal, geoCoords: CoordinatesGeographic): EquatorialCoordinates {
	return {
		declination: getDeclinationFromHorizontal(horCoords, geoCoords),
		rightAscension: getRightAscensionFromHorizontal(jd, horCoords, geoCoords)
	};
}
