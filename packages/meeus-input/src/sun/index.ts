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

export const Sun = {
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
