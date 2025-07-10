import type { Equinox } from "./earth";
import type {
	EclipticCoordinatesAtJulianDayFunction,
	EquatorialCoordinatesAtJulianDayFunction,
	EquatorialCoordinatesAtJulianDayWithObliquityFunction,
	JulianDayForJulianDayFunction,
	QuantityAtJulianDayFunction,
	QuantityInArcSecondAtJulianDayFunction,
	QuantityInAstronomicalUnitAtJulianDayFunction,
	QuantityInDegreeAtJulianDayFunction,
	QuantityInDegreeAtJulianDayWithEquinoxFunction,
	QuantityInKilometerPerSecondAtJulianDayFunction,
	QuantityInMagnitudeAtJulianDayFunction,
	RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction,
	SingleCoordinateDegreeAtJulianDayFunction
} from "./funcs";
import type {
	Albedo,
	ArcSecond,
	AstronomicalUnit,
	Day,
	Degree,
	GramPerCubicCentimeter,
	JulianDay,
	Kilogram24,
	Kilometer,
	KilometerPerSecond,
	Magnitude,
	MeterPerSquareSecond,
	Year
} from "./units";


/**
 * Common constants of planets
 */
export interface PlanetConstants {
  bulkDensity: GramPerCubicCentimeter,
  equatorialGravity: MeterPerSquareSecond,
  /**
   * Radius at the equator
   */
  equatorialRadius: Kilometer,
  escapeVelocity: KilometerPerSecond
  geometricAlbedo: Albedo,
  /**
   * Mass
   */
  mass: Kilogram24,
  /**
   * Mean radius
   */
  meanRadius: Kilometer,
  siderealOrbitPeriod: Year,
  siderealRotationPeriod: Day,
  visualMagnitude: Magnitude,
}

export interface PlanetBase {
  // Constant values (constants.ts)
  constants: PlanetConstants
  getAccurateRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
  getApparentGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayFunction
  // Heliocentric coordinates (coordinates.ts)
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayFunction
  getEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityFunction
  getEquatorialSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  // Geocentric coordinates (elliptical.ts)
  getGeocentricDistance: QuantityInAstronomicalUnitAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getMagnitude: QuantityInMagnitudeAtJulianDayFunction
  // Planet base properties (details.ts)
  getPhaseAngle: JulianDayForJulianDayFunction
  getPolarSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  // Rise Transit Set (additions to elliptical.ts)
  getRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
}

export interface Planet extends PlanetBase {
  // Extended planet base properties (details.ts)
  getAphelion: JulianDayForJulianDayFunction
  getEccentricity: QuantityAtJulianDayFunction
  getInclination: QuantityInDegreeAtJulianDayFunction
  // Planet elliptical properties (elliptical.ts)
  getInstantaneousVelocity: QuantityInKilometerPerSecondAtJulianDayFunction
  getLengthOfEllipse: QuantityInAstronomicalUnitAtJulianDayFunction
  getLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayFunction
  getLongitudeOfPerihelion: QuantityInDegreeAtJulianDayFunction
  // Planet orbital properties (orbital.ts)
  getMeanLongitude: QuantityInDegreeAtJulianDayWithEquinoxFunction
  getPerihelion: JulianDayForJulianDayFunction
  getVelocityAtAphelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getVelocityAtPerihelion: QuantityInKilometerPerSecondAtJulianDayFunction
  // Orbital elements (constants.ts)
  orbitalElements: PlanetOrbitalElements
}

export interface SaturnicentricCoordinates {
  latitude: Degree
  longitude: Degree
}

export interface SaturnRingSystem {
  earthCoordinates: SaturnicentricCoordinates
  majorAxis: ArcSecond
  minorAxis: ArcSecond
  northPolePositionAngle: Degree
  saturnicentricSunEarthLongitudesDifference: Degree
  sunCoordinates: SaturnicentricCoordinates
}

export type SaturnRingSystemFunction = (jd: JulianDay) => SaturnRingSystem

export interface SaturnPlanet extends Planet {
  getRingSystemDetails: SaturnRingSystemFunction
}

export interface JupiterPlanet extends Planet {
  getCentralMeridianLongitudes: Function
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
}


export type LengthArray<T, N extends number, R extends T[] = []> = number extends N ? T[] : R["length"] extends N ? R : LengthArray<T, N, [T, ...R]>;

/**
 * Elements of Planetary Orbits
 */
export interface PlanetOrbitalElements {
  [Equinox.MeanOfTheDate]: {
    inclination: LengthArray<Degree, 4>
    longitudeOfAscendingNode: LengthArray<Degree, 4>
    longitudeOfPerihelion: LengthArray<Degree, 4>
    meanLongitude: LengthArray<Degree, 4>
  },
  [Equinox.StandardJ2000]: {
    inclination: LengthArray<Degree, 4>
    longitudeOfAscendingNode: LengthArray<Degree, 4>
    longitudeOfPerihelion: LengthArray<Degree, 4>
    meanLongitude: LengthArray<Degree, 4>
  }
  eccentricity: LengthArray<number, 4>,
  semiMajorAxis: LengthArray<AstronomicalUnit, 4>
}
