import {
	dateFormatter,
	dateTimeFormatter,
	dayFormatter,
	degreesFormatter,
	kilometersFormatter,
	percentFormatter,
	timeFormatter,
	timeDurationFormatter,
	timeShortFormatter
} from "utils/formatters";

import { lang } from "./lang-store";

const locale = "ru";

export let formatDate = dateFormatter(locale);
export let formatDatetime = dateTimeFormatter(locale);
export let formatDays = dayFormatter(locale);
export let formatDegrees = degreesFormatter(locale);
export let formatKilometers = kilometersFormatter(locale);
export let formatPercent = percentFormatter(locale);
export let formatTime = timeFormatter(locale);
export let formatTimeDuration = timeDurationFormatter(locale);
export let formatTimeShort = timeShortFormatter(locale);

lang?.subscribe(locale => {
	formatDate = dateFormatter(locale);
	formatDatetime = dateTimeFormatter(locale);
	formatDays = dayFormatter(locale);
	formatDegrees = degreesFormatter(locale);
	formatKilometers = kilometersFormatter(locale);
	formatPercent = percentFormatter(locale);
	formatTime = timeFormatter(locale);
	formatTimeDuration = timeDurationFormatter(locale);
	formatTimeShort = timeShortFormatter(locale);
});
