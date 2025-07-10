import type { Degree, Hour, JulianDay, Kilometer, Millisecond, Radian, Second } from "./types";

export const HOUR_SECONDS: Second = 3600;
export const DAY_SECONDS: Second = HOUR_SECONDS * 24;
export const DAY_MS: Millisecond = DAY_SECONDS * 1000;

export const J1970: JulianDay = 2440588;
export const J2000: JulianDay = 2451545;

export const MJD_START: JulianDay = 2400000.5;
export const JULIAN_DAY_B1950_0: JulianDay = 2433282.4235; // See p.133 of AA.

export const PI: Radian = Math.PI;
export const PI_TWO: Radian = PI * 2;
export const PI_HALF: Radian = PI / 2;

export const DEG2RAD: Radian = PI / 180;
export const RAD2DEG: Degree = 180 / PI;
export const RAD2H: Hour = 12 / PI;
export const H2RAD: Radian = PI / 12;
export const H2DEG: Degree = 360 / 24;
export const DEG2H: Hour = 24 / 360;

export const ECLIPTIC_OBLIQUITY_J2000_0: Degree = 23.4392911; // see p.92 of AA.

export const EARTH_EQUATORIAL_RADIUS: Kilometer = 6378.14; // See p82 of AA.
export const EARTH_RADIUS_FLATTENING_FACTOR = 1 / 298.257; // See p82 of AA.
// 0.08181922145552321, See p82 of AA, sqrt(2f-f^2), where f = flattening factor
export const EARTH_MERIDIAN_ECCENTRICITY = Math.sqrt(EARTH_RADIUS_FLATTENING_FACTOR * 2 - Math.pow(EARTH_RADIUS_FLATTENING_FACTOR, 2));

export const CONSTANT_OF_ABERRATION = 20.49552; // See AA p.151
