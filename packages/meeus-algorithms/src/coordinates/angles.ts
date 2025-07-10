import { DEG2RAD, H2DEG, RAD2DEG } from "../consts";
import { getLocalSiderealTime } from "../utils/julian-day";

import type { CoordinatesGeographic, Degree, EquatorialCoordinates, JulianDay, Radian } from "../types";

/**
 * Parallactic angle of an object at given equatorial coordinates, at a given time and observer's location.
 *
 * @param {JulianDay} jd The julian day of the observation.
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @param {CoordinatesEquatorial} equCoords The object equatorial coordinates
 * @returns {Degree} The parallactic angle
 */
export function getParallacticAngle (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: CoordinatesGeographic): Degree {
	const localSiderealTime: Degree = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG;
	const HA: Radian = (localSiderealTime - equCoords.rightAscension) * DEG2RAD;

	const rEquCoords = {
		declination: equCoords.declination * DEG2RAD,
		rightAscension: equCoords.rightAscension * DEG2RAD
	};
	const rGeoCoords = {
		latitude: geoCoords.latitude * DEG2RAD,
		longitude: geoCoords.longitude * DEG2RAD
	};

	let angle = undefined;
	const declinationCosine = Math.cos(rEquCoords.declination);

	if (declinationCosine !== 0) {
		angle = Math.atan2(
			Math.sin(HA),
			Math.tan(rGeoCoords.latitude) * declinationCosine - Math.sin(rEquCoords.declination) * Math.cos(HA)
		) * RAD2DEG;
	} else {
		angle = (rGeoCoords.latitude >= 0) ? 180.0 : 0.0;
	}

	return angle;
}
