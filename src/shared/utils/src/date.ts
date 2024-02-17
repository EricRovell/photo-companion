import { isInteger } from "./validators";

/**
 * Calculates the duration between two dates in seconds.
 */
export function calcDuration(from: Date | null = null, to: Date | null = null): number {
	if (!from && !to) {
		throw new Error("Both dates should be provided");
	}

	if (!from && to) {
		from = dateFrom(to, { hours: 0, minutes: 0, seconds: 0 });

		return (to.getTime() - from.getTime()) / 1000;
	}

	if (from && !to) {
		to = dateFrom(from, { hours: 24, minutes: 0, seconds: 0 });

		return (to.getTime() - from.getTime()) / 1000;
	}

	const startTime = (from!).getTime();
	const endTime = (to!).getTime();

	if (endTime >= startTime) {
		return (endTime - startTime) / 1000;
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
	isInteger(month) && output.setMonth(month + 1);
	isInteger(date) && output.setDate(date);
	isInteger(hours) && output.setHours(hours);
	isInteger(minutes) && output.setMinutes(minutes);
	isInteger(seconds) && output.setSeconds(seconds);
	output.setMilliseconds(0);

	return output;
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
 * Convert the number of seconds to HH:MM:SS format.
 */
export function secondsToHoursAndMinutes(seconds: number): [ hours: number, minutes: number ] {
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return [ hours, minutes ];
}
