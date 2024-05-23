import type { Accessor } from "solid-js";
import type { UserLang } from "@lib/types";
import type { t } from "./translation.en";

export type Translation = typeof t;

export type DateFormatter = (value: Nullish<DateLike>) => string;
export type NumberFormatter = (value: number) => string;

interface Formatters {
	formatDate: DateFormatter;
	formatDatetime: DateFormatter;
	formatDays: NumberFormatter;
	formatDegrees: NumberFormatter;
	formatKilometers: NumberFormatter;
	formatPercent: NumberFormatter;
	formatTime: DateFormatter;
	formatTimeDuration: DateFormatter;
	formatTimeShort: DateFormatter;
}

export interface TranslationContextType {
	lang: Accessor<UserLang>,
	formatters: Accessor<Formatters>;
	t: Accessor<Translation>;
}
