import { formatTestDate } from "~test";
import { vi } from "vitest";

import { t } from "../consts/translation.en";
import { formatMessage } from "../lib/format-message";

import type { TranslationMock } from "../types";

type MockTranslation = ReturnType<TranslationMock["useTranslation"]>;

interface TranslationMockOptions {
	format?: ReturnType<NonNullable<MockTranslation["format"]>>;
	lang?: MockTranslation["lang"];
}

function createTranslation({ format, lang = () => "en" }: TranslationMockOptions = {}): MockTranslation {
	const formatters = {
		dateShort: (date: Nullish<DateLike>) => formatTestDate(date).slice(0, 10),
		datetime: formatTestDate,
		message: formatMessage,
		minutes: (minutes: number) => `${minutes} min`,
		timeShort: formatTestDate,
		...format
	};

	return {
		format: () => formatters,
		lang,
		t: () => t
	};
}

export const useTranslationMock = vi.fn<TranslationMock["useTranslation"]>(() => createTranslation());

export function configureTranslationMock(options: TranslationMockOptions): void {
	useTranslationMock.mockReset();
	useTranslationMock.mockReturnValue(createTranslation(options));
}
