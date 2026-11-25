import { MAX_SUPPORTED_YEAR, MIN_SUPPORTED_YEAR } from "moon-sun-calc";
import { DAYS_IN_WEEK, getMonthStart } from "utils/date";

export const MIN_TIMESTAMP = Date.UTC(MIN_SUPPORTED_YEAR, 0, 1);
export const END_TIMESTAMP = Date.UTC(MAX_SUPPORTED_YEAR + 1, 0, 1);

export const FIRST_CALENDAR_MONTH = getMonthStart(new Date(MIN_SUPPORTED_YEAR, 0, 1));
export const LAST_CALENDAR_MONTH = getMonthStart(new Date(MAX_SUPPORTED_YEAR, 11, 1));

export const MOON_CALENDAR_SAMPLE_HOUR = 12;
export const MOON_CALENDAR_FIRST_WEEKDAY = 1;
export const MOON_CALENDAR_PHASE_PRECISION = 0.001;

// January 7, 2024 was a Sunday. Use UTC so the weekday labels are stable everywhere.
export const MOON_CALENDAR_WEEKDAYS = Array.from({ length: DAYS_IN_WEEK }, (_, index) => (
	Date.UTC(2024, 0, 7 + MOON_CALENDAR_FIRST_WEEKDAY + index)
));

export const PHASE_VALUES = {
	FIRST_QUARTER: 0.25,
	FULL_MOON: 0.5,
	NEW_MOON: 0,
	THIRD_QUARTER: 0.75
} as const;
