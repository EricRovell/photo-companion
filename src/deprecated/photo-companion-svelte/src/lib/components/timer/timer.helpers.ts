import { padWithZero } from "utils";
import { round } from "utils/math";

/**
 * Breaks a 2-digit number into 2 digits.
 */
const toDigits = (number: number): number[] => {
	if (number < 10) {
		return [ 0, number ];
	}

	return [ Math.floor((number / 10) % 10), number % 10 ];
};

/**
 * Transform the timestamp into time parts.
 */
export const getTime = (timestamp: number) => {
	let seconds = round(timestamp / 1000);
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return {
		hours: toDigits(hours),
		minutes: toDigits(minutes),
		seconds: toDigits(seconds)
	};
};

/**
 * Creates a `datetime` attribute string from timestamp.
 */
export const getDateTimeString = (timestamp: number) => {
	const d = new Date(timestamp);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const date = d.getDate();
	const hours = d.getHours();
	const minutes = d.getMinutes();
	
	return `${year}-${padWithZero(month)}-${padWithZero(date)}T${padWithZero(hours)}:${padWithZero(minutes)}:00.000`;
};
