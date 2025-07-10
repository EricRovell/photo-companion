import type {
	EclipticCoordinatesAtJulianDayFunction,
	EclipticCoordinatesAtJulianDayWithEquinoxFunction,
	EquatorialCoordinatesAtJulianDayFunction,
	EquatorialCoordinatesAtJulianDayWithObliquityFunction,
	QuantityAtJulianDayFunction,
	QuantityInArcSecondAtJulianDayFunction,
	QuantityInAstronomicalUnitAtJulianDayFunction,
	QuantityInDegreeAtJulianDayFunction,
	SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
} from "./funcs";

export enum Obliquity {
  Mean = "Mean",
  True = "True"
}

export enum Equinox {
  MeanOfTheDate = "MeanOfTheDate",
  StandardJ2000 = "StandardJ2000"
}

export interface NaturalMoon {
  getAge: QuantityAtJulianDayFunction,
  getAgeName: Function
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getArgumentOfLatitude: QuantityInDegreeAtJulianDayFunction
  getEquatorialHorizontalParallax: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEclipticLatitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticLongitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricElongation: QuantityInDegreeAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityFunction
  getGeocentricSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getMeanAnomaly: QuantityInDegreeAtJulianDayFunction
  getMeanElongation: QuantityInDegreeAtJulianDayFunction
  getMeanLongitude: QuantityInDegreeAtJulianDayFunction
  getMeanLongitudeAscendingNode: QuantityInDegreeAtJulianDayFunction
  getMeanLongitudePerigee: QuantityInDegreeAtJulianDayFunction
  getPhaseAngle: QuantityInDegreeAtJulianDayFunction
  getPositionAngleOfTheBrightLimb: QuantityInDegreeAtJulianDayFunction
  getRadiusVectorInKilometer: QuantityInAstronomicalUnitAtJulianDayFunction
  getTimeOfMeanPhase: Function
  horizontalParallax: QuantityInDegreeAtJulianDayFunction
  horizontalParallaxToRadiusVector: Function
  radiusVectorToHorizontalParallax: Function
  trueLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayFunction
}
