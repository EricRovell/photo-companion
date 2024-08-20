import { DAY_MS, J1970, J2000 } from "../consts";

import type { JulianCentury, JulianDay } from "../types";

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
