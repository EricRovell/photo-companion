import { DEG2RAD, H2DEG, RAD2DEG } from "../constants";
import { getLocalSiderealTime } from "../juliandays";

import type { Degree, EquatorialCoordinates, GeographicCoordinates, JulianDay, Radian } from "../types";

/**
 * Paralactic angle of an object at given equatorial coordinates, at a given time and observer's location.
 * @param {JulianDay} jd The julian day of the observation.
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates} equCoords The object equatorial coordinates
 * @returns {Degree} The paralactic angle
 */
export function getParallacticAngle (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: GeographicCoordinates): Degree {
	const lmst: Degree = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG;
	const HA: Radian = (lmst - equCoords.rightAscension) * DEG2RAD;

	const rEquCoords = {
		declination: equCoords.declination * DEG2RAD,
		rightAscension: equCoords.rightAscension * DEG2RAD
	};
	const rGeoCoords = {
		latitude: geoCoords.latitude * DEG2RAD,
		longitude: geoCoords.longitude * DEG2RAD
	};

	let angle = undefined;

	const cosdec = Math.cos(rEquCoords.declination);
	if (cosdec !== 0) {
		angle = Math.atan2(
			Math.sin(HA),
			Math.tan(rGeoCoords.latitude) * cosdec - Math.sin(rEquCoords.declination) * Math.cos(HA)
		) * RAD2DEG;
	} else {
		angle = (rGeoCoords.latitude >= 0) ? 180.0 : 0.0;
	}

	return angle;
}

