import { DEG2H, DEG2RAD, H2RAD, RAD2DEG } from "../consts";
import { getFlatteningCorrections } from "../earth/coordinates";
import { getLocalSiderealTime } from "../utils/julian-day";
import { fmod24 } from "../utils/math";

/**
 @module Coordinates
 */
import type {
	ArcSecond,
	AstronomicalUnit,
	CoordinatesEquatorial,
	CoordinatesGeographic,
	CoordinatesTopocentric,
	Hour,
	JulianDay,
	Radian
} from "../types";

/**
 * Transform equatorial coordinates to topocentric coordinates.
 *
 * @param {JulianDay} jd The julian day
 * @param {CoordinatesEquatorial } coords The equatorial coordinates
 * @param {AstronomicalUnit} distance The object geocentric distance
 * @param {CoordinatesGeographic} geoCoords The geographic coordinates of the observer's location.
 * @returns {CoordinatesTopocentric}
 */
export function transformEquatorialToTopocentric (jd: JulianDay,
	coords: CoordinatesEquatorial,
	distance: AstronomicalUnit,
	geoCoords: CoordinatesGeographic): CoordinatesTopocentric {
	if (geoCoords.height === undefined) {
		throw new Error("The geographic coordinates must contain a value for \"height\".");
	}
	const corrections = getFlatteningCorrections(geoCoords.height, geoCoords.latitude);

	const factor: ArcSecond = 8.794;
	const sinpi: ArcSecond = Math.sin(factor / 3600 * DEG2RAD) / distance;
	const theta0: Hour = getLocalSiderealTime(jd, 0);
	const H: Radian = fmod24(theta0 + geoCoords.longitude * DEG2H - coords.rightAscension * DEG2H) * H2RAD;

	const decSin = Math.sin(coords.declination * DEG2RAD);
	const decCos = Math.cos(coords.declination * DEG2RAD);

	const numeratorAlpha: Radian = -1 * corrections.rhocosphi * sinpi * Math.sin(H);
	const denominatorAlpha: Radian = decCos - corrections.rhocosphi * sinpi * Math.cos(H);
	const tanDeltaAlpha: Radian = numeratorAlpha / denominatorAlpha;

	const cosDeltaAlpha: Radian = Math.cos(Math.atan(tanDeltaAlpha));
	const numeratorDelta: Radian = (decSin - corrections.rhosinphi * sinpi) * cosDeltaAlpha;
	const denominatorDelta: Radian = decCos - (corrections.rhocosphi * sinpi * Math.cos(H));
	const tanDeltaPrime: Radian = numeratorDelta / denominatorDelta;

	return {
		declination: Math.atan(tanDeltaPrime) * RAD2DEG,
		rightAscension: coords.rightAscension + Math.atan(tanDeltaAlpha) * RAD2DEG
	};
}
