import { YEAR } from "../constants";

/**
 * Formats time from `Date` object as "HH:MM".
 */
export const formatTime = (timestamp: number) => {
	return Intl.DateTimeFormat("ru-RU", {
		hour: "numeric",
		minute: "numeric"
	}).format(timestamp);
};

/**
 * Calculates the angle in degrees from `Date` object using time for 24 hour circle.
 */
export const getAngleFromTime = (date = new Date()): number => {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return Math.round(360 * (hours * 60 + minutes) / (24 * 60));
};

/**
 * Validate if the given date is within actual schedule.
 */
export const validateDate = (date: Date) => {
	return date.getFullYear() === YEAR;
};

/**
 * Increments the given date by number of days.
 */
export const incrementDateByDay = (date: Date | string, dayCount: number): Date => {
	const currentDate = new Date(date);
	const nextDate = new Date(currentDate.getTime());
	nextDate.setDate(nextDate.getDate() + dayCount);

	return nextDate;
};

/**
 * Round the number up to the desired precision.
 */
export function round(number: number, digits = 0, base = Math.pow(10, digits)): number {
	return Math.round(number * base) / base + 0;
}
