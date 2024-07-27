import { isNullable, isValidDate } from "utils/validators";

import type { UserLang } from "@lib/types";

/**
 * Calculates the angle in degrees from `Date` object using time for 24 hour circle.
 */
export function getAngleFromTime(date: Nullish<DateLike> = new Date(), fallback = 0): number {
	if (isNullable(date) || !isValidDate(date)) {
		return fallback;
	}

	const hours = new Date(date).getHours();
	const minutes = new Date(date).getMinutes();
	return Math.round(360 * (hours * 60 + minutes) / (24 * 60));
}

/**
 * Returns a part of ISO string (removes all data after minutes) for an datetime input.
 */
export function getDateTimeString(date: DateLike = new Date()): string {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	const timezoneOffset = date.getTimezoneOffset() * 60000;
	return (new Date(date.getTime() - timezoneOffset)).toISOString().slice(0, 16);
}

/**
 * Parses a query `datetime` string in format YYYY-MM-DD-hh-mm
 * into a Date object.
 */
export function parseQueryDate(input: string): Date {
	if (isNullable(input)) {
		return new Date();
	}

	const [ yy, mm, dd, h, m ] = input.split("-").map(Number);
	const output = new Date(yy, mm - 1, dd, h, m);

	if (!isValidDate(output)) {
		console.warn(`Invalid date input: ${input}`);
	}

	return output;
}

export function createQueryDate(d: DateLike = new Date()): string {
	if (typeof d === "number") {
		d = new Date(d);
	}

	return [
		d.getFullYear(),
		d.getMonth() + 1,
		d.getDate(),
		d.getHours(),
		d.getMinutes()
	]
		.map(value => value.toString().padStart(2, "0"))
		.join("-");
}

const REPLACE_REGEX = /T|:/g;
const DELIMITER = "-";

/**
 * Parses the datetime sting in format YYYY-MM-DDThh:mm into YYYY-MM-DD-hh-mm.
 */
export function parseDateTimeString(input: string): string {
	return input.replace(REPLACE_REGEX, DELIMITER);
}

export function getUserLocation(): Promise<GeolocationCoordinates> {
	return new Promise((resolve, reject) => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(position => {
				resolve(position.coords);
			}, reject);
		} else {
			reject(new Error("Geolocation not supported"));
		}
	});
}

interface DateParams {
	date: number
	hours: number
	milliseconds: number
	minutes: number
	month: number
	seconds: number
	year: number,
}

export function getDate({ date, hours, milliseconds, minutes, month, seconds, year }: Partial<DateParams>) {
	const now = new Date();

	(typeof year === "number") && now.setFullYear(year);
	(typeof month === "number") && now.setMonth(month);
	(typeof date === "number") && now.setDate(date);
	(typeof hours === "number") && now.setHours(hours);
	(typeof minutes === "number") && now.setMinutes(minutes);
	(typeof seconds === "number") && now.setSeconds(seconds);
	(typeof milliseconds === "number") && now.setMilliseconds(milliseconds);

	return now;
}

/**
 * Sets the boolean attribute depending on state.
 */
export function setAttribute(state?: boolean, value = "") {
	return state ? value : undefined;
}

/**
 * Only two languages are supported: "en" and "ru".
 * 
 * If user has no preferred "ru" language, fallbacks to "en".
 */
export function detectUserLanguage(fallback: UserLang = "en"): UserLang {
	if (isNullable(globalThis.window)) {
		return fallback;
	}

	if (window.navigator.languages.some(item => item.includes("ru"))) {
		return "ru";
	}

	return "en";
}
