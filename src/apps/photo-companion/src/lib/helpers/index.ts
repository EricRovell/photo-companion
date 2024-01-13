/**
 * Round the number up to the desired precision.
 */
export function round(number: number, digits = 0, base = Math.pow(10, digits)): number {
	return Math.round(number * base) / base + 0;
}

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
export function getAngleFromTime(date = new Date()): number {
	if (!isValidDate(date)) {
		return 0;
	}

	const hours = date.getHours();
	const minutes = date.getMinutes();
	return Math.round(360 * (hours * 60 + minutes) / (24 * 60));
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

export function isValidDate(date: Date | number | string | undefined): boolean {
	if (date instanceof Date) {
		return !isNaN(date.getTime());
	}

	if (typeof date === "number" || typeof date === "string") {
		return isValidDate(new Date(date));
	}

	return false;
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

export function calcEventDuration(start: Date | null = null, end: Date | null = null): number {
	if (!start && !end) {
		throw new Error("Both dates should be provided");
	}

	if (!start && end) {
		start = new Date(end);
		start.setHours(0);
		start.setMinutes(0);
		end.setSeconds(0);

		return (end.getTime() - start.getTime()) / 1000;
	}

	if (start && !end) {
		end = new Date(start);
		end.setHours(24);
		end.setMinutes(0);
		end.setSeconds(0);

		return (end.getTime() - start.getTime()) / 1000;
	}

	const startTime = (start!).getTime();
	const endTime = (end!).getTime();

	if (endTime >= startTime) {
		return (endTime - startTime) / 1000;
	}

	const midStart = new Date(start as Date);
	midStart.setHours(0);
	midStart.setMinutes(0);
	midStart.setSeconds(0);
	const midStartTime = midStart.getTime();

	const midEnd = new Date(end as Date);
	midEnd.setHours(24);
	midEnd.setMinutes(0);
	midEnd.setSeconds(0);
	const midEndTime = midEnd.getTime();

	return ((midEndTime - startTime) + (endTime - midStartTime)) / 1000;
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
	date: Date | number = new Date,
	options: Intl.DateTimeFormatOptions = {},
	locales: string | string[] = "ru-RU"
) {
	if (typeof date === "number") {
		date = new Date(date);
	}

	return Intl.DateTimeFormat(locales, options).format(date);
}
