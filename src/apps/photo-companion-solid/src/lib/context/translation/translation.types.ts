import type { Accessor } from "solid-js";

import type { t } from "./translation.en";
import type { UserLang } from "@lib/types";

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
	formatters: Accessor<Formatters>;
	lang: Accessor<UserLang>,
	t: Accessor<Translation>;
}
