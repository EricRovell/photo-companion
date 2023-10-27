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
