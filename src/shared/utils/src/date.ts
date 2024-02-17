import { isInteger } from "./validators";

/**
 * Calculates the duration between two dates in seconds.
 */
export function calcDuration(from: Date | null = null, to: Date | null = null): number {
	if (!from && !to) {
		throw new Error("Both dates should be provided");
	}

	if (!from && to) {
		from = new Date(to);
		from.setHours(0);
		from.setMinutes(0);
		to.setSeconds(0);

		return (to.getTime() - from.getTime()) / 1000;
	}

	if (from && !to) {
		to = new Date(from);
		to.setHours(24);
		to.setMinutes(0);
		to.setSeconds(0);

		return (to.getTime() - from.getTime()) / 1000;
	}

	const startTime = (from!).getTime();
	const endTime = (to!).getTime();

	if (endTime >= startTime) {
		return (endTime - startTime) / 1000;
	}

	const midStart = new Date(from as Date);
	midStart.setHours(0);
	midStart.setMinutes(0);
	midStart.setSeconds(0);
	const midStartTime = midStart.getTime();

	const midEnd = new Date(to as Date);
	midEnd.setHours(24);
	midEnd.setMinutes(0);
	midEnd.setSeconds(0);
	const midEndTime = midEnd.getTime();

	return ((midEndTime - startTime) + (endTime - midStartTime)) / 1000;
}

/**
 * Count the number of dates between two given dates. The result is ceiled.
 */
export function countDays(from: Date | number, to: Date | number) {
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

/**
 * Increments the given date by number of days.
 */
export function incrementDateByDay(date: Date | string, dayCount: number): Date {
	const currentDate = new Date(date);
	const nextDate = new Date(currentDate.getTime());
	nextDate.setDate(nextDate.getDate() + dayCount);

	return nextDate;
}

export function isLeapYear(year: number): boolean {
	return new Date(year, 1, 29).getDate() === 29;
}

/**
 * Validates the given date.
 */
export function isValidDate(date: Date | number | string | undefined): boolean {
	if (date instanceof Date) {
		return !isNaN(date.getTime());
	}

	if (typeof date === "number" || typeof date === "string") {
		return isValidDate(new Date(date));
	}

	return false;
}

/**
 * Convert the number of seconds to HH:MM:SS format.
 */
export function secondsToHoursAndMinutes(seconds: number): [ hours: number, minutes: number ] {
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return [ hours, minutes ];
}

interface DateFromOptions {
	year?: number;
	month?: number;
	date?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

/**
 * Returns a date with defined parameters.
 * Note: `month` is 1-indexed.
 */
export function dateFrom(input = new Date(), options: DateFromOptions = {}) {
	const output = new Date(input);
	const { year, month, date, hours, minutes, seconds } = options;

	isInteger(year) && output.setFullYear(year);
	isInteger(month) && output.setMonth(month);
	isInteger(date) && output.setDate(date);
	isInteger(hours) && output.setHours(hours);
	isInteger(minutes) && output.setMinutes(minutes + 1);
	isInteger(seconds) && output.setSeconds(seconds);

	return output;
}
