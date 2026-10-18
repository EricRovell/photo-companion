import { createEffect, createMemo, createResource } from "solid-js";
import {
	dateFormatter,
	dateShortFormatter,
	dateTimeFormatter,
	dayFormatter,
	degreesFormatter,
	kilometersFormatter,
	listFormatter,
	metersFormatter,
	minutesFormatter,
	percentFormatter,
	timeDurationFormatter,
	timeFormatter,
	timeShortDurationFormatter,
	timeShortFormatter
} from "utils/formatters";
import { isNullable } from "utils/validators";

import { useSettings } from "~/features/settings";

import { formatMessage } from "./lib/format-message";

const TRANSLATIONS = {
	"en": () => import("./consts/translation.en"),
	"ru": () => import("./consts/translation.ru")
};

export function createTranslationState() {
	const { settings } = useSettings();

	const lang = () => settings.language;

	const [ t ] = createResource(lang, async () => {
		const dict = await TRANSLATIONS[lang()]();
		return dict.t;
	});

	const format = createMemo(() => ({
		date: dateFormatter(lang()),
		dateShort: dateShortFormatter(lang()),
		datetime: dateTimeFormatter(lang()),
		days: dayFormatter(lang()),
		degrees: degreesFormatter(lang()),
		kilometers: kilometersFormatter(lang()),
		list: listFormatter(lang()),
		message: formatMessage,
		meters: metersFormatter(lang()),
		minutes: minutesFormatter(lang()),
		percent: percentFormatter(lang()),
		time: timeFormatter(lang()),
		timeDuration: timeDurationFormatter(lang()),
		timeShort: timeShortFormatter(lang()),
		timeShortDuration: timeShortDurationFormatter(lang())
	}));

	createEffect(() => {
		if (!isNullable(globalThis.window)) {
			document.documentElement.setAttribute("lang", lang());
		}
	});

	return {
		format,
		lang,
		t
	};
}
