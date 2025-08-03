import { isNullable } from "utils/validators";

import type { UserLang } from "~/types";

/**
 * Only two languages are supported: "en" and "ru".
 *
 * If user has no preferred "ru" language, fallbacks to "en".
 */
export function detectUserLanguage(fallback: UserLang = "en"): UserLang {
	if (isNullable(globalThis.window)) {
		return fallback;
	}

	if (window.navigator.languages.some(item => item.includes("ru"))) {
		return "ru";
	}

	return "en";
}
