import {
	degreesFormatter,
	timeDurationFormatter,
	timeFormatter,
	timeShortFormatter,
	percentFormatter,
	kilometersFormatter,
	dateTimeFormatter,
	dayFormatter,
	dateFormatter
} from "utils/formatters";

import { lang } from "./lang-store";

const locale = "ru";

export let formatDegrees = degreesFormatter(locale);
export let formatTimeDuration = timeDurationFormatter(locale);
export let formatTime = timeFormatter(locale);
export let formatTimeShort = timeShortFormatter(locale);
export let formatPercent = percentFormatter(locale);
export let formatKilometers = kilometersFormatter(locale);
export let formatDatetime = dateTimeFormatter(locale);
export let formatDays = dayFormatter(locale);
export let formatDate = dateFormatter(locale);

lang?.subscribe(locale => {
	formatDegrees = degreesFormatter(locale);
	formatTimeDuration = timeDurationFormatter(locale);
	formatTime = timeFormatter(locale);
	formatTimeShort = timeShortFormatter(locale);
	formatPercent = percentFormatter(locale);
	formatKilometers = kilometersFormatter(locale);
	formatDatetime = dateTimeFormatter(locale);
	formatDays = dayFormatter(locale);
	formatDate = dateFormatter(locale);
});
