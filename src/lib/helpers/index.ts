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
