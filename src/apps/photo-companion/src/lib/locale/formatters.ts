import {
	degreesFormatter,
	timeDurationFormatter,
	timeFormatter,
	timeShortFormatter,
	percentFormatter,
	kilometersFormatter,
	dateTimeFormatter
} from "utils/formatters";

const locale = "ru";

export const formatDegrees = degreesFormatter(locale);
export const formatTimeDuration = timeDurationFormatter(locale);
export const formatTime = timeFormatter(locale);
export const formatTimeShort = timeShortFormatter(locale);
export const formatPercent = percentFormatter(locale);
export const formatKilometers = kilometersFormatter(locale);
export const formatDatetime = dateTimeFormatter(locale);
