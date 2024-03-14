import { padWithZero } from ".";
import { round } from "./math";
import { isNullable } from "./validators";

export function formatDegrees(input: number, locale = "ru"): string {
	return Intl.NumberFormat(locale, {
		style: "unit",
		unit: "degree"
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

export function formatTime(timestamp: number): string {
	let seconds = round(timestamp / 1000);
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return `${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(seconds)}`;
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
