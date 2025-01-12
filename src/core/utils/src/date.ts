import { isInteger, isNullable } from "./validators";

/**
 * Calculates the duration between two dates in seconds:
 * 
 * 1. Both dates are provided, returns the difference;
 * 2. `from` is not specified - the starting point is the beginning of the same day as the `to` date;
 * 3. `to` is not specified - the ending point is the beginning of the next day after the `from` date;
 */
export function calcDuration(from: Nullish<DateLike> = null, to: Nullish<DateLike> = null): number {
	if (isNullable(from) && isNullable(to)) {
		throw new Error("Both dates should be provided");
	}

	if (isNullable(from) && !isNullable(to)) {
		from = dateFrom(to, { hours: 0, minutes: 0, seconds: 0 });

		return new Date(to).getTime() - from.getTime();
	}

	if (!isNullable(from) && isNullable(to)) {
		to = dateFrom(from, { hours: 24, minutes: 0, seconds: 0 });

		return to.getTime() - new Date(from).getTime();
	}

	// @ts-expect-error: the null-case was checked above
	const startTime = new Date(from).getTime();
	// @ts-expect-error: the null-case was checked above
	const endTime = new Date(to).getTime();

	if (endTime >= startTime) {
		return endTime - startTime;
	}

	const midStartTime = dateFrom(from as Date, {
		hours: 0,
		minutes: 0,
		seconds: 0
	}).getTime();

	const midEndTime = dateFrom(to as Date, {
		hours: 24,
		minutes: 0,
		seconds: 0
	}).getTime();

	return (midEndTime - startTime) + (endTime - midStartTime);
}

/**
 * Count the number of dates between two given dates. The result is ceiled.
 */
export function countDays(from: DateLike, to: DateLike) {
	if (typeof from === "number") {
		from = new Date(from);
	}

	if (typeof to === "number") {
		to = new Date(to);
	}

	return Math.ceil(
		Math.abs(to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)
	);
}

interface DateFromOptions {
	date?: number;
	hours?: number;
	minutes?: number;
	month?: number;
	seconds?: number;
	year?: number;
}

/**
 * Returns a new date from a given date with predefined parameters.
 *
 * Note: `month` is 1-indexed and the ms is set to 0 by default.
 */
export function dateFrom(input: DateLike = new Date(), options: DateFromOptions = {}): Date {
	const output = new Date(input);
	const { date, hours, minutes, month, seconds, year } = options;

	if (isInteger(year)) {
		output.setFullYear(year);
	}

	if (isInteger(month)) {
		output.setMonth(month - 1);
	}

	if (isInteger(date)) {
		output.setDate(date);
	}

	if (isInteger(hours)) {
		output.setHours(hours);
	}

	if (isInteger(minutes)) {
		output.setMinutes(minutes);
	}

	if (isInteger(seconds)) {
		output.setSeconds(seconds);
	}

	output.setMilliseconds(0);

	return output;
}

/**
 * Increments the given date by number of days.
 */
export function incrementDateByDay(date: DateLike | string, dayCount: number): Date {
	const currentDate = new Date(date);
	const nextDate = new Date(currentDate.getTime());
	nextDate.setDate(nextDate.getDate() + dayCount);

	return nextDate;
}

/**
 * Checks the given year for a leap year.
 */
export function isLeapYear(year: number): boolean {
	return new Date(year, 1, 29).getDate() === 29;
}

/**
 * Checks if two given date instances points to the same date.
 */
export function isSameDay(a: DateLike, b: DateLike, UTC = false) {
	a = new Date(a);
	b = new Date(b);

	if (UTC) {
		return (
			a.getUTCDate() === b.getUTCDate() &&
			a.getUTCMonth() === b.getUTCMonth() &&
			a.getUTCFullYear() === b.getUTCFullYear()
		);
	}

	return (
		a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear()
	);
}
