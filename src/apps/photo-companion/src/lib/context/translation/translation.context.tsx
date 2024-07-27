import { type Accessor, createContext, createMemo, type ParentProps, useContext } from "solid-js";
import {
	dateFormatter,
	dateTimeFormatter,
	dayFormatter,
	degreesFormatter,
	kilometersFormatter,
	percentFormatter,
	timeDurationFormatter,
	timeFormatter,
	timeShortFormatter
} from "utils/formatters";
import { isNullable } from "utils/validators";

import { useSettings } from "../settings";
import { t as translationEN } from "./translation.en";
import { t as translationRU } from "./translation.ru";

import type { Translation, TranslationContextType } from "./translation.types";

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
		throw new Error("useTranslation must be used within a TranslationContext.Provider");
	}

	return value;
}
