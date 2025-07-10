import { DAY_MS, DEG2H, J1970, J2000 } from "../consts";
import { fmod24, fmod360 } from "./math";

import type { Degree, Hour, JulianCentury, JulianDay, JulianMillennium } from "../types";

/**
 * Converts the gregorian calendar date to Julian Day.
 *
 * The Julian Day (JD) is a continuous count of days and fractions thereof
 * from beginning of the year -4712. By tradition, the Julian Day begins
 * at Greenwich mean noon.
 */
export function getJulianDay(input: DateLike = Date.now()): JulianDay {
	const timestamp = input instanceof Date
		? input.valueOf()
		: input;

	return timestamp / DAY_MS - 0.5 + J1970;
}

/**
 * Calculates the calendar date from Julian Day.
 *
 * Both positive and negative years are supported,
 * but not negative Julian Day numbers.
 */
export function getDate(jd: JulianDay): Date {
	return new Date((jd + 0.5 - J1970) * DAY_MS);
}

/**
 * The Julian Century as the time interval of 36 525 days.
 */
export function getJulianCentury(jd: JulianDay): JulianCentury {
	return (jd - J2000) / 36525;
}

/**
 * The Julian Millennium (time interval of 365250 days)
 */
export function getJulianMillennium (jd: JulianDay): JulianMillennium {
	return (jd - 2451545) / 365250;
}

/**
 * The local mean sidereal time (sun's clock time) for a given julian day at a given longitude on Earth.
 */
export function getLocalSiderealTime (jd: JulianDay, longitude: Degree): Hour {
	const t = getJulianCentury(jd);

	// Greenwich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
	const gmst = 280.460_618_37
		+ 360.985_647_366_29 * (jd - 2451545)
		+ 0.000_387_933 * t * t
		- t * t * t / 38_710_000;

	return fmod24(fmod360(gmst + longitude) * DEG2H);
}
