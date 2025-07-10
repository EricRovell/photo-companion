import type { ArcSecond, Degree, Hour, JulianDay, Meter, Pixel } from "./units";

/**
 * Geographic coordinates.
 *
 * Note: East is positive.
 */
export interface CoordinatesGeographic {
	height?: Meter;
	latitude: Degree;
	longitude: Degree;
}

/**
 * Coordinates in the ecliptic (Celestial) system, that is
 * the system formed by projecting the place of
 * Earth's orbit (ecliptic) onto the spherical sky.
 */
export type CoordinatesEcliptic = Omit<CoordinatesGeographic, "height">;

/**
 * Coordinates on the Equatorial system, that is in the
 * system formed by projecting the Earth equator onto the
 * spherical sky.
 */
export interface CoordinatesEquatorial {
	declination: Degree;
	epoch?: JulianDay;
	rightAscension: Degree;
}

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
export interface CoordinatesTopocentric {
	declination: Degree;
	epoch?: JulianDay;
	rightAscension: Hour;
}

/**
 * Coordinates of an object as seen from an observer's location, at a given
 * time. The altitude is counted from the (idealistic) plane horizon. The
 * azimuth is the angle counted from the geographical north or south.
 */
export interface CoordinatesHorizontal {
	altitude: Degree;
	azimuth: Degree;
}

export interface Coordinates2D {
	x: number;
	y: number;
}

export interface Coordinates3D {
	x: number;
	y: number;
	z: number;
}

export interface Sexagesimal {
	milliseconds: number
	minutes: number,
	radix: number,
	seconds: number
	sign: number,
}

export interface Point {
	x: Pixel;
	y: Pixel;
}
export interface PointNum {
	x: number
	y: number
}

export interface CoordinatesEclipticCorrection {
	DeltaLatitude: ArcSecond;
	DeltaLongitude: ArcSecond;
}

export interface CoordinatesEquatorialCorrection {
	DeltaDeclination: ArcSecond;
	DeltaRightAscension: ArcSecond;
}
