import { DEG2RAD, ONE_UA_IN_KILOMETERS, RAD2DEG } from "../consts";
import { getRadiusVector as getEarthRadiusVector } from "../../earth/coordinates";
import { Sun } from "../../sun";
import { Equinox, Obliquity } from "../../types";
import { getGeocentricEquatorialCoordinates, getRadiusVectorInKilometer } from "./coordinates";

import type { ArcSecond, Degree, JulianDay, Kilometer, Radian } from "../types";

/**
 * The geocentric elongation of the moon
 */
export function getGeocentricElongation (jd: JulianDay): Degree {
	const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd, Equinox.MeanOfTheDate);
	const moonCoords = getGeocentricEquatorialCoordinates(jd, Obliquity.Mean);

	const decRadSun = sunCoords.declination * DEG2RAD;
	const decRadMoon = moonCoords.declination * DEG2RAD;
	const raRadSun = sunCoords.rightAscension * DEG2RAD;
	const raRadMoon = moonCoords.rightAscension * DEG2RAD;

	const sins = Math.sin(decRadSun) * Math.sin(decRadMoon);
	const coss = Math.cos(decRadSun) * Math.cos(decRadMoon) * Math.cos(raRadSun - raRadMoon);

	// See first equation 48.2 of AA, p. 345.
	return Math.acos(sins + coss) * RAD2DEG;
}

/**
 * The phase angle (angle Sun-Moon-Earth)
 */
export function getPhaseAngle (jd: JulianDay): Degree {
	// Geocentric elongation of the Moon from the Sun
	const psi: Radian = getGeocentricElongation(jd) * DEG2RAD;

	// Distance Earth-Moon
	const Delta: Kilometer = getRadiusVectorInKilometer(jd);

	// Distance Earth-Sun
	const R: Kilometer = getEarthRadiusVector(jd) * ONE_UA_IN_KILOMETERS;

	return Math.atan2(R * Math.sin(psi), Delta - R * Math.cos(psi)) * RAD2DEG;
}

/**
 * The position angle of the bright limb.
 * The position angle of the Moon's bright limb is the position angle of the midpoint of the illuminated limb of
 * the Moon, reckoned eastward from the North Point of the disk (not from the axis of rotation of the lunar globe).
 */
export function getPositionAngleOfTheBrightLimb (jd: JulianDay): Degree {
	const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd, Equinox.MeanOfTheDate);
	const moonCoords = getGeocentricEquatorialCoordinates(jd, Obliquity.Mean);

	const alpha0 = (sunCoords.rightAscension as Degree) * DEG2RAD;
	const alpha = (moonCoords.rightAscension) * DEG2RAD;
	const delta0 = (sunCoords.declination as Degree) * DEG2RAD;
	const delta = (moonCoords.declination) * DEG2RAD;

	const y = Math.cos(delta0) * Math.sin(alpha0 - alpha);
	const x = Math.sin(delta0) * Math.cos(delta) - (Math.cos(delta0) * Math.sin(delta) * Math.cos(alpha0 - alpha));

	return Math.atan2(y, x) * RAD2DEG;
}

/**
 * The illuminated fraction of the Moon as seen from the Earth as value between 0 and 1.
 */
export function getIlluminatedFraction (jd: JulianDay): number {
	const phaseAngle = getPhaseAngle(jd) * DEG2RAD;
	return (1 + Math.cos(phaseAngle)) / 2;
}

/**
 * Equatorial horizontal parallax
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEquatorialHorizontalParallax (jd: JulianDay): Degree {
	return Math.asin(6378.14 / getRadiusVectorInKilometer(jd)) * RAD2DEG;
}

/**
 * Geocentric Moon semi-diameter.
 * Error is less than 0.0005 arc second (see AA p391).
 */
export function getGeocentricSemiDiameter (jd: JulianDay): ArcSecond {
	return 358_473_400 / getRadiusVectorInKilometer(jd);
}
