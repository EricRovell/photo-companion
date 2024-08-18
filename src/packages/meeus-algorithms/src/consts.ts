import type { Degree, Hour, JulianDay, Millisecond, Radian, Second } from "./types/units";

export const HOUR_SECONDS: Second = 3600;
export const DAY_SECONDS: Second = HOUR_SECONDS * 24;
export const DAY_MS: Millisecond = DAY_SECONDS * 1000;

export const J1970: JulianDay = 2440588;
export const J2000: JulianDay = 2451545;

export const MJD_START: JulianDay = 2400000.5;

export const PI: Radian = Math.PI;
export const PI_TWO: Radian = PI * 2;
export const PI_HALF: Radian = PI / 2;

export const DEG2RAD: Radian = PI / 180;
export const RAD2DEG: Degree = 180 / PI;
export const RAD2H: Hour = 12 / PI;
export const H2RAD: Radian = PI / 12;
export const H2DEG: Degree = 360 / 24;
export const DEG2H: Hour = 24 / 360;
