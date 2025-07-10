import { DEG2RAD, H2DEG, RAD2DEG } from "../consts";
import { getLocalSiderealTime } from "../utils/julian-day";
import { fmod360, fmod90 } from "../utils/math";

import type { CoordinatesGeographic, CoordinatesHorizontal, Degree, EquatorialCoordinates, JulianDay } from "../types";

/**
 * Horizontal (local) altitude (where horizon is zero degrees)
 *
 * @param {JulianDay} jd The julian day
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates } equCoords The equatorial coordinates of the target
 * @returns {Degree}
 */
export function getHorizontalAltitude (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: CoordinatesGeographic): Degree {
	const localSiderealTime = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG;
	const hourAngle = (localSiderealTime - equCoords.rightAscension) * DEG2RAD;
	const declination = equCoords.declination * DEG2RAD;
	const latitude = geoCoords.latitude * DEG2RAD;
	const value = Math.asin(Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle));

	return fmod90(value * RAD2DEG);
}

/**
 * Horizontal (local) azimuth.
 *
 * @param {JulianDay} jd The julian day
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates } equCoords The equatorial coordinates of the target
 * @returns {Degree}
 */
export function getHorizontalAzimuth (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: CoordinatesGeographic): Degree {
	const localSiderealTime = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG;
	const hourAngle = (localSiderealTime - equCoords.rightAscension) * DEG2RAD;
	const declination = equCoords.declination * DEG2RAD;
	const latitude = geoCoords.latitude * DEG2RAD;
	const value = Math.atan2(
		Math.sin(hourAngle),
		Math.cos(hourAngle) * Math.sin(latitude) - Math.tan(declination) * Math.cos(latitude)
	);

	return fmod360(value * RAD2DEG);
}

/**
 * Transform equatorial coordinates to horizontal coordinates.
 *
 * @param {JulianDay} jd The julian day
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates } equCoords The equatorial coordinates of the target
 * @returns {CoordinatesHorizontal}
 */
export function transformEquatorialToHorizontal (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: CoordinatesGeographic): CoordinatesHorizontal {
	return {
		altitude: getHorizontalAltitude(jd, equCoords, geoCoords),
		azimuth: getHorizontalAzimuth(jd, equCoords, geoCoords)
	};
}
