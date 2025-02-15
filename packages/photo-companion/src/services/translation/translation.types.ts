import type { Accessor } from "solid-js";

import type { t as tEn } from "./translation.en";
import type { t as tRu } from "./translation.ru";
import type { UserLang } from "~/types";

export type DateFormatter = (value: Nullish<DateLike>) => string;
export type NumberFormatter = (value: number) => string;

interface Formatters {
	formatDate: DateFormatter;
	formatDatetime: DateFormatter;
	formatDays: NumberFormatter;
	formatDegrees: NumberFormatter;
	formatKilometers: NumberFormatter;
	formatMeters: NumberFormatter;
	formatPercent: NumberFormatter;
	formatTime: DateFormatter;
	formatTimeDuration: DateFormatter;
	formatTimeShort: DateFormatter;
}

export interface TranslationContextType {
	formatters: Accessor<Formatters>;
	lang: Accessor<UserLang>,
	t: Accessor<typeof tEn | typeof tRu>;
}
