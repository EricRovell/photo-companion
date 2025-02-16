import { createEffect, createMemo, createResource } from "solid-js";
import {
	dateFormatter,
	dateTimeFormatter,
	dayFormatter,
	degreesFormatter,
	kilometersFormatter,
	metersFormatter,
	percentFormatter,
	timeDurationFormatter,
	timeFormatter,
	timeShortFormatter
} from "utils/formatters";
import { isNullable } from "utils/validators";

import { useSettings } from "~/services/settings";

const TRANSLATIONS = {
	"en": () => import("./translation.en"),
	"ru": () => import("./translation.ru")
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
		datetime: dateTimeFormatter(lang()),
		days: dayFormatter(lang()),
		degrees: degreesFormatter(lang()),
		kilometers: kilometersFormatter(lang()),
		meters: metersFormatter(lang()),
		percent: percentFormatter(lang()),
		time: timeFormatter(lang()),
		timeDuration: timeDurationFormatter(lang()),
		timeShort: timeShortFormatter(lang())
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
