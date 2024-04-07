import { createMemo } from "solid-js";
import { settings } from "../settings";
import { t as dictEn } from "./dict.en";
import { t as dictRu } from "./dict.ru";

export const lang = () => settings().language;
export const t = createMemo(() => lang() === "en" ? dictEn : dictRu);
