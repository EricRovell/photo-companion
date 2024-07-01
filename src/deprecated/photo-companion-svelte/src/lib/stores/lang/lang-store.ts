import { derived } from "svelte/store";
import { settingsStore } from "../settings";
import { t as dictEn } from "./dict.en";
import { t as dictRu } from "./dict.ru";
import { detectUserLanguage } from "@lib/helpers";

export const lang = derived(settingsStore, $store => {
	return $store?.language ?? detectUserLanguage();
});

export const t = derived(lang, $lang => {
	return $lang === "en" ? dictEn : dictRu;
});
