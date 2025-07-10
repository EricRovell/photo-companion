import type { ArcSecond, Degree, Hour, JulianDay, Meter, Pixel } from "./units";

/**
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky.
 */
export interface EquatorialCoordinates {
  declination: Degree
  epoch?: JulianDay
  rightAscension: Degree
}

/**
 * Topocentric coordinates.
 */
export interface TopocentricCoordinates {
  declination: Degree
  epoch?: JulianDay
  rightAscension: Hour
}

/**
 * Geographic coordinates, East Positive!
 */
export interface GeographicCoordinates {
  height?: Meter
  latitude: Degree
  longitude: Degree
}

/**
 * Coordinates in the Ecliptic (a.k.a. Celestial) system, that is the system
 * formed by projecting the plane of Earth's orbit (the ecliptic)
 * onto the spherical sky.
 */
export interface EclipticCoordinates {
  latitude: Degree
  longitude: Degree
}


export interface GalacticCoordinates {
  latitude: Degree
  longitude: Degree
}

/**
 * Coordinates of an object as seen from an observer's location, at a given
 * time. The altitude is counted from the (idealistic) plane horizon. The
 * azimuth is the angle counted from the geographical north or south.
 */
export interface HorizontalCoordinates {
  altitude: Degree
  azimuth: Degree
}

export interface Coordinates2D {
  X: number
  Y: number
}

export interface Coordinates3D {
  X: number
  Y: number
  Z: number
}

export interface Sexagesimal {
  milliseconds: number
  minutes: number,
  radix: number,
  seconds: number
  sign: number,
}

export interface Point {
  x: Pixel
  y: Pixel
}
export interface PointNum {
  x: number
  y: number
}

export interface EclipticCoordinatesCorrection {
  DeltaLatitude: ArcSecond
  DeltaLongitude: ArcSecond
}

export interface EquatorialCoordinatesCorrection {
  DeltaDeclination: ArcSecond
  DeltaRightAscension: ArcSecond
}
