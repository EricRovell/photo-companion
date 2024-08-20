import type { Degree, JulianDay, Meter } from "./units";

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
