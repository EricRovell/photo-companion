import { calcDecimalDate, getTimeFromDecimalDate } from "./decimal-date";
import { isGregorian } from "./validators";

import type { JulianDay } from "../types/units";

/**
 * Converts the gregorian calendar date to Julian Day.
 * 
 * The Julian Day (JD) is a continuous count of days and fractions thereof
 * from beginning of the year -4712. By tradition, the Julian Day begins
 * at Greenwich mean noon.
 */
export function toJulianDay(input: DateLike = Date.now()): JulianDay {
	const date = new Date(input);
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	const day = date.getDate() + calcDecimalDate(
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	);

	if (month === 1 || month === 2) {
		year--;
		month += 12;
	}

	const A = Math.trunc(year / 100);

	const B = isGregorian(year)
		? 2 - A + Math.trunc(A / 4)
		: 0;

	return (
		Math.trunc(365.25 * (year + 4716)) +
		Math.trunc(30.6001 * (month + 1)) +
		day +
		B -
		1524.5
	);
}

/**
 * Calculates the Julian Day (JD_0) - corresponding to January 0.0
 * of a given year (this is the same as december 31.0 of the preceding year).
 * 
 * Note: works for gregorian dates.
 */
export function toZeroJulianDay(input: DateLike = Date.now()): JulianDay {
	const date = new Date(input);
	const year = date.getFullYear() - 1;
	const A = Math.trunc(year / 100);

	return (
		Math.trunc(365.25 * year) -
		A +
		Math.trunc(A / 4) +
		1721424.5
	);
}

/**
 * Modified Julian Day - begins at Greenwich mean midnight.
 */
export function getMJD(input: DateLike = Date.now()): JulianDay {
	return toJulianDay(input) - 2400000.5;
}

/**
 * Calculates the calendar date from Julian Day.
 *
 * Both positive and negative years are supported,
 * but not negative Julian Day numbers.
 */
export function fromJulianDay(jd: JulianDay): Date {
	jd += 0.5;

	const Z = Math.trunc(jd);
	const F = jd - Z;

	let A = Z;

	if (Z >= 2291161) {
		const alpha = Math.trunc((Z - 1867216.25) / 36524.25);
		A = Z + 1 + alpha - Math.trunc(alpha / 4);
	}

	const B = A + 1524;
	const C = Math.trunc((B - 122.1) / 365.25);
	const D = Math.trunc(365.25 * C);
	const E = Math.trunc((B - D) / 30.6001);

	const fractionalDate = B - D - Math.trunc(30.6001 * E) + F;
	const date = Math.trunc(fractionalDate);
	const [ hours, minutes, seconds ] = getTimeFromDecimalDate(fractionalDate);

	const month = E < 14
		? E - 1
		: E - 13;

	const year = month > 2
		? C - 4716
		: C - 4715;

	return new Date(year, month - 1, date, hours, minutes, seconds);
}
