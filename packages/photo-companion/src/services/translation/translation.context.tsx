import { createContext, createEffect, createMemo, createResource, type ParentProps, Show, useContext } from "solid-js";
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

import type { TranslationContextType } from "./translation.types";

const TranslationContext = createContext<TranslationContextType>();

const TRANSLATIONS = {
	"en": () => import("./translation.en"),
	"ru": () => import("./translation.ru")
};

export function TranslationProvider(props: ParentProps) {
	const { settings } = useSettings();

	const lang = () => settings.language;

	const [ t ] = createResource(lang, async () => {
		const dict = await TRANSLATIONS[lang()]();
		return dict.t;
	});

	const formatters = createMemo(() => ({
		formatDate: dateFormatter(lang()),
		formatDatetime: dateTimeFormatter(lang()),
		formatDays: dayFormatter(lang()),
		formatDegrees: degreesFormatter(lang()),
		formatKilometers: kilometersFormatter(lang()),
		formatMeters: metersFormatter(lang()),
		formatPercent: percentFormatter(lang()),
		formatTime: timeFormatter(lang()),
		formatTimeDuration: timeDurationFormatter(lang()),
		formatTimeShort: timeShortFormatter(lang())
	}));

	createEffect(() => {
		if (!isNullable(globalThis.window)) {
			document.documentElement.setAttribute("lang", lang());
		}
	});

	return (
		<Show when={t()}>
			{(t) => (
				<TranslationContext.Provider value={{ formatters, lang, t }}>
					{props.children}
				</TranslationContext.Provider>
			)}
		</Show>
	);
}

export function useTranslation() {
	const value = useContext(TranslationContext);

	if (isNullable(value)) {
		throw new Error("useTranslation must be used within a TranslationContext.Provider");
	}

	return value;
}
