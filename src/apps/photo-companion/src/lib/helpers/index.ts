import { isNullable, isValidDate } from "@shared/utils";

/**
 * Formats time from `Date` object as "HH:MM".
 */
export function formatTime(timestamp: number) {
	if (!isValidDate(timestamp)) {
		return "";
	}

	return Intl.DateTimeFormat("ru-RU", {
		hour12: false,
		hour: "numeric",
		minute: "numeric"
	}).format(timestamp);
}

/**
 * Calculates the angle in degrees from `Date` object using time for 24 hour circle.
 */
export function getAngleFromTime(date: Date | null = new Date(), fallback: number = 0): number {
	if (isNullable(date) || !isValidDate(date)) {
		return fallback;
	}

	const hours = date.getHours();
	const minutes = date.getMinutes();
	return Math.round(360 * (hours * 60 + minutes) / (24 * 60));
}

export function getDateTimeString(date = new Date()): string {
	const timezoneOffset = date.getTimezoneOffset() * 60000;
	return (new Date(date.getTime() - timezoneOffset)).toISOString().slice(0, 16);
}

/**
 * Prevents the page scroll depending on condition.
 */
export function preventPageScroll(condition: boolean) {
	if (!globalThis.window) {
		return;
	}

	if (condition) {
		// prevent page scroll, mostly for safari hack
		document.body.style.cssText = `
			top: -${window.scrollY}px;
			position: fixed;
			overflow-y: scroll;
			overscroll-behavior: none;
		`;

		return;
	}

	const scrollY: number = parseInt(document.body.style.top || "0");
	document.body.style.cssText = "";
	window.scrollTo({
		top: -1 * scrollY,
		behavior: "auto"
	});
}

/**
 * Convert the number of seconds to HH:MM:SS format.
 */
export const secondsToHoursAndMinutes = (seconds: number): [ hours: number, minutes: number ] => {
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return [ hours, minutes ];
};

export function isValidLocation(lat: number, lon: number): boolean {
	return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function parseQueryDate(input: string): string {
	if (!input) {
		return getDateTimeString();
	}

	const [ yy, mm, dd, h, m ] = input.split("-").map(Number);

	const date = new Date(yy, mm - 1, dd, h, m);

	if (!isValidDate(date)) {
		return "invalid";
	}

	return getDateTimeString(date);
}

export function createQueryDate(d: Date = new Date()): string {
	return [
		d.getFullYear(),
		d.getMonth() + 1,
		d.getDate(),
		d.getHours(),
		d.getMinutes()
	]
		.map(value => value < 10 ? `0${value}` : value.toString())
		.join("-");
}

export async function getUserLocation(): Promise<{ lat: number, lon: number } | null> {
	if (!navigator.geolocation) {
		return null;
	}

	const position: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
		return navigator.geolocation.getCurrentPosition(resolve, reject);
	});

	if (position) {
		return {
			lat: position.coords.latitude,
			lon: position.coords.longitude
		};
	}

	return null;
}

interface DateParams {
	year: number,
	month: number
	date: number
	hours: number
	minutes: number
	seconds: number
	milliseconds: number
}

export function getDate({ year, month, date, hours, minutes, seconds, milliseconds }: Partial<DateParams>) {
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

export function renderDatetime(
	date: Date | number | null = new Date,
	options: Intl.DateTimeFormatOptions = {},
	locales: string | string[] = "ru-RU"
) {
	if (isNullable(date)) {
		return "";
	}

	if (typeof date === "number") {
		date = new Date(date);
	}

	return Intl.DateTimeFormat(locales, options).format(date);
}

/**
 * Sets the boolean attribute depending on state.
 */
export function setAttribute(state: boolean) {
	return state ? "" : undefined;
}

export function scrollToTop() {
	if (isNullable(globalThis.window)) {
		return;
	}

	window.scrollTo({
		behavior: "smooth",
		top: 0
	});
}
