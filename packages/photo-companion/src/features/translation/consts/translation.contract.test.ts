import { describe, expect, it } from "vitest";

import {
	MESSAGE_PLACEHOLDER_PATTERN,
	MESSAGE_TAG_PATTERN
} from "./message-template";
import { t as en } from "./translation.en";
import { t as ru } from "./translation.ru";

interface TranslationDictionary {
	readonly [key: string]: string | TranslationDictionary;
}

interface TemplateSignature {
	placeholders: string[];
	tags: string[];
}

function flatten(
	dictionary: TranslationDictionary,
	prefix = "",
	result = new Map<string, string>()
) {
	for (const [ key, value ] of Object.entries(dictionary)) {
		const path = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "string") {
			result.set(path, value);
		} else {
			flatten(value, path, result);
		}
	}

	return result;
}

function getTemplateSignature(message: string, path: string): TemplateSignature {
	const placeholders = Array.from(message.matchAll(MESSAGE_PLACEHOLDER_PATTERN), match => match[1]);
	const tags: string[] = [];
	const openTags: string[] = [];

	for (const match of message.matchAll(MESSAGE_TAG_PATTERN)) {
		const closing = Boolean(match[1]);
		const name = match[2];

		if (closing) {
			const openTag = openTags.pop();

			if (openTag !== name) {
				throw new Error(`${path} closes <${name}> while <${openTag}> is open`);
			}
		} else {
			openTags.push(name);
			tags.push(name);
		}
	}

	if (openTags.length > 0) {
		throw new Error(`${path} has unclosed <${openTags[openTags.length - 1]}> tag`);
	}

	const remainingSyntax = message
		.replace(MESSAGE_PLACEHOLDER_PATTERN, "")
		.replace(MESSAGE_TAG_PATTERN, "");

	if (/[{}]/.test(remainingSyntax)) {
		throw new Error(`${path} has malformed placeholder syntax`);
	}

	return {
		placeholders: placeholders.sort(),
		tags: tags.sort()
	};
}

const translations = {
	en: flatten(en),
	ru: flatten(ru)
};

const templateCases = Object.entries(translations).flatMap(([ locale, messages ]) => (
	Array.from(messages, ([ path, message ]) => ({
		locale,
		message,
		path
	}))
));

const parityCases = Array.from(translations.en, ([ path, message ]) => ({
	message,
	path,
	translatedMessage: translations.ru.get(path)
}));

describe("translation dictionary contract", () => {
	it("contains the same message paths in every locale", () => {
		expect(Array.from(translations.ru.keys()).sort())
			.toEqual(Array.from(translations.en.keys()).sort());
	});

	it.each(templateCases)("$locale template $path is valid", ({ message, path }) => {
		expect(() => getTemplateSignature(message, path)).not.toThrow();
	});

	it.each(parityCases)("$path uses the same values and rich tags in every locale", ({ message, path, translatedMessage }) => {
		if (translatedMessage === undefined) {
			throw new Error(`Missing Russian translation for ${path}`);
		}

		expect(getTemplateSignature(translatedMessage, path), path)
			.toEqual(getTemplateSignature(message, path));
	});
});
