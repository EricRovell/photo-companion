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

	const startTime = (start as Date).getTime();
	const endTime = (end as Date).getTime();

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
