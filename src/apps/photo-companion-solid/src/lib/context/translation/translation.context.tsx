import { createContext, useContext, type ParentProps, createMemo, type Accessor } from "solid-js";
import { isNullable } from "utils/validators";

import { useSettings } from "../settings";
import { t as translationEN } from "./translation.en";
import { t as translationRU } from "./translation.ru";
import type { Translation, TranslationContextType } from "./translation.types";

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

const TranslationContext = createContext<TranslationContextType>();

export function TranslationProvider(props: ParentProps) {
	const { getSettings } = useSettings();
	const lang = () => getSettings().language;
	const t: Accessor<Translation> = createMemo(() => lang() === "en" ? translationEN : translationRU);

	const formatters = createMemo(() => ({
		formatDate: dateFormatter(lang()),
		formatDatetime: dateTimeFormatter(lang()),
		formatDays: dayFormatter(lang()),
		formatDegrees: degreesFormatter(lang()),
		formatKilometers: kilometersFormatter(lang()),
		formatPercent: percentFormatter(lang()),
		formatTime: timeFormatter(lang()),
		formatTimeDuration: timeDurationFormatter(lang()),
		formatTimeShort: timeShortFormatter(lang())
	}));

	return (
		<TranslationContext.Provider value={{ formatters, lang, t }}>
			{props.children}
		</TranslationContext.Provider>
	);
}

export function useTranslation() {
	const value = useContext(TranslationContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a TranslationContext.Provider");
	}

	return value;
}
