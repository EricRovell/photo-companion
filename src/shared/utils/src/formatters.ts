import { isNullable, isValidDate } from "./validators";

export function formatDegrees(input: number, locale = "ru"): string {
	return Intl.NumberFormat(locale, {
		style: "unit",
		unit: "degree"
	}).format(input);
}

/**
 * Formats a time in ms into a countdown in format HH:MM:SS.
 * 
 * Note: `formatTime` is not a good option, as it uses local timezone,
 * hence wrong results.
 */
export function formatDuration(input: number, locale = "ru") {
	return Intl.DateTimeFormat(locale, {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "UTC"
	}).format(input);
}

export function formatKilometers(input: number, locale = "ru"): string {
	return Intl.NumberFormat(locale, {
		style: "unit",
		unit: "kilometer"
	}).format(input);
}

export function formatPercent(input: number, locale = "ru"): string {
	return Intl.NumberFormat(locale, {
		style: "unit",
		unit: "percent"
	}).format(input);
}

/**
 * Formats a date into HH:MM:SS time string format.
 */
export function formatTime(input: Nullish<DateLike>, locale = "ru", timeZone?: string) {
	if (!isValidDate(input)) {
		return "";
	}

	return Intl.DateTimeFormat(locale, {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone
	}).format(input);
}

/**
 * Formats a time into HH:MM format.
 */
export function formatTimeShort(input: Nullish<DateLike>, locale = "ru"): string {
	if (!isValidDate(input)) {
		return "";
	}

	return Intl.DateTimeFormat(locale, {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit"
	}).format(input);
}

/**
 * Replaces the entries within the string in curly braces (can be specified via regex parameter)
 * with values in object.
 * 
 * template("Hello, {name}!", { name: "Peter" }) -> "Hello, Peter!"
 * 
 * In case no replacement is provided, the capture leaves as it is, just curly braces are removed.
 * 
 * template("Hello, {name}!", {}) -> "Hello, name!"
 */
export function template(input: string, dict: Record<string, string | number>, regex = /{(.*?)}/g) {
	const replacer = (match: string, capture: string) => {
		const trimmedCapture = capture.trim();
		const replaceValue = dict[trimmedCapture];
		
		if (isNullable(replaceValue)) {
			return trimmedCapture;
		}

		return dict[trimmedCapture].toString();
	};

	return input.replace(regex, replacer);
}
