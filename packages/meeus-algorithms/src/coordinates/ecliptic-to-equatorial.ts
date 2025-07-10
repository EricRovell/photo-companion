import { DEG2RAD, ECLIPTIC_OBLIQUITY_J2000_0 } from "../consts";
import { fmod360, fmod90 } from "../utils/math";

import type { CoordinatesEcliptic, Degree, EquatorialCoordinates } from "../types";

/**
 * Equatorial right ascension from ecliptic coordinates
 *
 * @param {CoordinatesEcliptic} coords The ecliptic coordinates
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Degree} Degree (v3.2+), not HOURS (< v3.2)
 */
export function getRightAscensionFromEcliptic (coords: CoordinatesEcliptic, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
	const epsilonRad = epsilon * DEG2RAD;

	const coordsRad = {
		latitude: coords.latitude * DEG2RAD,
		longitude: coords.longitude * DEG2RAD
	};

	const value = Math.atan2(
		Math.sin(coordsRad.longitude) * Math.cos(epsilonRad) - Math.tan(coordsRad.latitude) * Math.sin(epsilonRad),
		Math.cos(coordsRad.longitude)
	);

	return fmod360(value / DEG2RAD);
}

/**
 * Equatorial declination from ecliptic coordinates
 *
 * @param {CoordinatesEcliptic} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @return {Degree}
 */
export function getDeclinationFromEcliptic (coords: CoordinatesEcliptic, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
	const epsilonRad = epsilon * DEG2RAD;

	const coordsRad = {
		latitude: coords.latitude * DEG2RAD,
		longitude: coords.longitude * DEG2RAD
	};

	const value = Math.asin(
		Math.sin(coordsRad.latitude) * Math.cos(epsilonRad)
		+ Math.cos(coordsRad.latitude) * Math.sin(epsilonRad) * Math.sin(coordsRad.longitude)
	);

	return fmod90(value / DEG2RAD);
}

/**
 * Transform ecliptic longitude and latitude to equatorial coordinates.
 *
 * @param {CoordinatesEcliptic} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @returns {EquatorialCoordinates}
 */
export function transformEclipticToEquatorial (coords: CoordinatesEcliptic, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): EquatorialCoordinates {
	return {
		declination: getDeclinationFromEcliptic(coords, epsilon),
		rightAscension: getRightAscensionFromEcliptic(coords, epsilon)
	};
}
