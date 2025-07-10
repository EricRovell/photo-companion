import { constants } from "./constants";
import {
	getApparentGeocentricEclipticCoordinates,
	getApparentGeocentricEclipticLatitude,
	getApparentGeocentricEclipticLongitude,
	getApparentGeocentricEquatorialCoordinates,
	getGeocentricEclipticCoordinates,
	getGeocentricEclipticLatitude,
	getGeocentricEclipticLongitude,
	getGeocentricEquatorialCoordinates,
	getGeometricEclipticLongitude,
	getGeometricFK5EclipticLatitude,
	getGeometricFK5EclipticLongitude,
	getRiseTransitSet,
	getVariationGeometricEclipticLongitude
} from "./coordinates";
import {
	getEquationOfTheCenter,
	getMeanAnomaly,
	getMeanLongitudeReferredToMeanEquinoxOfDate,
	getTrueAnomaly
} from "./sun";

/**
 @module Sun
 */
import type { NaturalSun } from "../types";

export const Sun: NaturalSun = {
	constants,
	getApparentGeocentricEclipticCoordinates,
	getApparentGeocentricEclipticLatitude,
	getApparentGeocentricEclipticLongitude,
	getApparentGeocentricEquatorialCoordinates,
	getEquationOfTheCenter,
	getGeocentricEclipticCoordinates,
	getGeocentricEclipticLatitude,
	getGeocentricEclipticLongitude,
	getGeocentricEquatorialCoordinates,
	getGeometricEclipticLongitude,
	getGeometricFK5EclipticLatitude,
	getGeometricFK5EclipticLongitude,
	getMeanAnomaly,
	getMeanLongitudeReferredToMeanEquinoxOfDate,
	getRiseTransitSet,
	getTrueAnomaly,
	getVariationGeometricEclipticLongitude
};
