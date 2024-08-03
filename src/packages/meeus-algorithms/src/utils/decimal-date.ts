import { DAY_SECONDS, HOUR_SECONDS } from "../consts";

export type Time = [ hours: number, minutes: number, seconds: number ];

/**
 * Calculates time from decimal date
 *
 * Note: integer part is not important.
 *
 * - 2.5 -> 12:00:00
 * - 4.81 -> 19:26:24
 */
export function getTimeFromDecimalDate(fractionalDate: number): Time {
	const fractional = fractionalDate - Math.trunc(fractionalDate);
	let seconds = fractional * DAY_SECONDS;

	const hours = Math.floor(seconds / HOUR_SECONDS);
	seconds -= hours * HOUR_SECONDS;

	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return [ hours, minutes, Math.round(seconds) ];
}

export function calcDecimalDate(hours = 0, minutes = 0, seconds = 0): number {
	return (hours * HOUR_SECONDS + minutes * 60 + seconds) / DAY_SECONDS;
}
