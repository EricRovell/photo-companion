import { isValidDate } from "./validators";

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

export const listFormatter = (locale = "en") => {
	const formatter = new Intl.ListFormat(locale, {
		style: "long",
		type: "conjunction"
	});

	return (values: string[]) => formatter.format(values);
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
 * Formats a localized numeric date with two-digit month and day values.
 */
export const dateShortFormatter = getDateTimeFormatter({
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
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
	maximumFractionDigits: 1,
	minimumFractionDigits: 1,
	style: "unit",
	unit: "degree"
});

/**
 * Formats a whole number of minutes as localized hours and minutes.
 * Callers choose how to round partial minutes.
 */
export const hoursMinutesFormatter = (locale = "en", unitDisplay: Intl.NumberFormatOptions["unitDisplay"] = "short") => {
	const formatUnit = (unit: "hour" | "minute") => getNumberFormatter({
		style: "unit",
		unit,
		unitDisplay
	})(locale);

	const hour = formatUnit("hour");
	const minute = formatUnit("minute");

	return (totalMinutes: number) => {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		if (!hours) {
			return minute(minutes);
		}

		return minutes ? `${hour(hours)} ${minute(minutes)}` : hour(hours);
	};
};

/**
 * Formats a numeric value into kilometers unit.
 */
export const kilometersFormatter = getNumberFormatter({
	maximumFractionDigits: 1,
	minimumFractionDigits: 0,
	style: "unit",
	unit: "kilometer"
});

/**
 * Formats a numeric value into kilometers unit.
 */
export const metersFormatter = getNumberFormatter({
	style: "unit",
	unit: "meter"
});

/**
 * Formats a numeric value into a compact minutes unit.
 */
export const minutesFormatter = getNumberFormatter({
	style: "unit",
	unit: "minute",
	unitDisplay: "short"
});

/**
 * Formats a numeric value into % unit.
 */
export const percentFormatter = getNumberFormatter({
	maximumFractionDigits: 1,
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
	hour: "2-digit",
	hourCycle: "h23",
	minute: "2-digit",
	second: "2-digit",
	timeZone: "UTC"
});

/**
 * Formats a date into HH:MM:SS time string format.
 */
export const timeFormatter = getDateTimeFormatter({
	hour: "2-digit",
	hourCycle: "h23",
	minute: "2-digit",
	second: "2-digit"
});

/**
 * Formats a time into HH:MM format.
 */
export const timeShortFormatter = getDateTimeFormatter({
	hour: "2-digit",
	hourCycle: "h23",
	minute: "2-digit"
});

export function timeShortDurationFormatter(locale?: string) {
	const formatter = timeShortFormatter(locale);
	return (start: DateLike, end: DateLike) => `${formatter(start)} — ${formatter(end)}}`;
}
