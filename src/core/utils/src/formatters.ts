import { isNullable, isValidDate } from "./validators";

export const getNumberFormatter = (options?: Intl.NumberFormatOptions) => (locale = "en") => {
	const formatter = new Intl.NumberFormat(locale, options);

	return (value: number) => formatter.format(value);
};

export const getDateTimeFormatter = (options?: Intl.DateTimeFormatOptions) => (locale = "en") => {
	const formatter = new Intl.DateTimeFormat(locale, options);

	return (value: Nullish<DateLike>) => {
		return isValidDate(value)
			? formatter.format(value)
			: "";
	};
};

// formatters

/**
 * Formats a numeric value into days unit.
 */
export const dayFormatter = getNumberFormatter({
	style: "unit",
	unit: "day",
	unitDisplay: "long"
});

/**
 * Formats date-time.
 */
export const dateFormatter = getDateTimeFormatter({
	dateStyle: "long"
});

/**
 * Formats date-time.
 */
export const dateTimeFormatter = getDateTimeFormatter({
	dateStyle: "long",
	timeStyle: "long"
});

/**
 * Formats a value as a degree unit.
 */
export const degreesFormatter = getNumberFormatter({
	style: "unit",
	unit: "degree"
});

/**
 * Formats a numeric value into kilometers unit.
 */
export const kilometersFormatter = getNumberFormatter({
	style: "unit",
	unit: "kilometer"
});

/**
 * Formats a numeric value into % unit.
 */
export const percentFormatter = getNumberFormatter({
	style: "unit",
	unit: "percent"
});

/**
 * Formats a number of ms into a countdown in format HH:MM:SS.
 * 
 * Note: `formatTime` is not a good option, as it uses local timezone,
 * hence wrong results.
 */
export const timeDurationFormatter = getDateTimeFormatter({
	hourCycle: "h23",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	timeZone: "UTC"
});

/**
 * Formats a date into HH:MM:SS time string format.
 */
export const timeFormatter = getDateTimeFormatter({
	hourCycle: "h23",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
});

/**
 * Formats a time into HH:MM format.
 */
export const timeShortFormatter = getDateTimeFormatter({
	hourCycle: "h23",
	hour: "2-digit",
	minute: "2-digit"
});

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
export function template(input: string, dict: Record<string, string | number>, regex = /{(.*?)}/g): string {
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
