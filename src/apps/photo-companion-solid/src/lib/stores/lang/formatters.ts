import { createEffect, createRoot } from "solid-js";
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

export let formatDate = dateFormatter(lang());
export let formatDatetime = dateTimeFormatter(lang());
export let formatDays = dayFormatter(lang());
export let formatDegrees = degreesFormatter(lang());
export let formatKilometers = kilometersFormatter(lang());
export let formatPercent = percentFormatter(lang());
export let formatTime = timeFormatter(lang());
export let formatTimeDuration = timeDurationFormatter(lang());
export let formatTimeShort = timeShortFormatter(lang());

createRoot(() => {
	createEffect(() => {
		formatDate = dateFormatter(lang());
		formatDatetime = dateTimeFormatter(lang());
		formatDays = dayFormatter(lang());
		formatDegrees = degreesFormatter(lang());
		formatKilometers = kilometersFormatter(lang());
		formatPercent = percentFormatter(lang());
		formatTime = timeFormatter(lang());
		formatTimeDuration = timeDurationFormatter(lang());
		formatTimeShort = timeShortFormatter(lang());
	});
});
