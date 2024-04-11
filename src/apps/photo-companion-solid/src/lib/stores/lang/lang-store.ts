import { createMemo, createRoot } from "solid-js";
import { settings } from "../settings";
import { t as dictEn } from "./dict.en";
import { t as dictRu } from "./dict.ru";

export const { lang, t } = createRoot(() => {
	const lang = createMemo(() => settings().language);
	const t = createMemo(() => lang() === "en" ? dictEn : dictRu);

	return { lang, t };
});
