import { isNullable } from "utils/validators";

import type { JSX } from "solid-js";

import {
	MESSAGE_PLACEHOLDER_PATTERN,
	MESSAGE_RICH_TAG_PATTERN,
	MESSAGE_TOKEN_PATTERN
} from "../consts/message-template";

type PlaceholderNames<Input extends string> = string extends Input
	? string
	: Input extends `${string}{${infer Name}}${infer Rest}`
		? Name | PlaceholderNames<Rest>
		: never;

type RichTagNames<Input extends string> = string extends Input
	? string
	: Input extends `${string}<${infer Name}>${infer Rest}`
		? Name extends `/${string}`
			? RichTagNames<Rest>
			: Name | RichTagNames<Rest>
		: never;

type RichMessageFormatter = (children: JSX.Element) => JSX.Element;

type MessagePrimitive = number | string;
type MessageValue = JSX.Element | RichMessageFormatter;

type MessageValues<Input extends string> = string extends Input
	? Record<string, JSX.Element | RichMessageFormatter>
	: Record<PlaceholderNames<Input>, JSX.Element> & Record<RichTagNames<Input>, RichMessageFormatter>;

type MessageResult<Values> = [Values[keyof Values]] extends [MessagePrimitive]
	? string
	: JSX.Element;

export type MessageFormatter = typeof formatMessage;

function missingValue(name: string): never {
	throw new Error(`Missing translation template value: ${name}`);
}

function formatPlainMessage(
	input: string,
	replacements: Partial<Record<string, MessageValue>>
): string {
	return input.replace(MESSAGE_PLACEHOLDER_PATTERN, (_match, name: string) => {
		const replacement = replacements[name];

		if (typeof replacement !== "number" && typeof replacement !== "string") {
			return missingValue(name);
		}

		return replacement.toString();
	});
}

interface RichFrame {
	children: JSX.Element[];
	name?: string;
}

/**
 * Formats a translated message with JSX values and rich-text tags.
 *
 * `{icon}` inserts a JSX value. `<link>text</link>` delegates rendering to
 * a formatter supplied under the `link` key without parsing or injecting HTML.
 */
function formatRichMessage(
	input: string,
	replacements: Partial<Record<string, MessageValue>>
): JSX.Element {
	const frames: RichFrame[] = [ { children: [] } ];
	let textIndex = 0;

	for (const match of input.matchAll(MESSAGE_TOKEN_PATTERN)) {
		const matchIndex = match.index;
		const frame = frames[frames.length - 1];

		if (matchIndex > textIndex) {
			frame.children.push(input.slice(textIndex, matchIndex));
		}

		const placeholderName = match[1];
		const closingTag = match[2];
		const tagName = match[3];

		if (placeholderName) {
			const replacement = replacements[placeholderName];

			if (isNullable(replacement) || typeof replacement === "function") {
				missingValue(placeholderName);
			}

			frame.children.push(replacement);
		} else if (tagName && !closingTag) {
			frames.push({
				children: [],
				name: tagName
			});
		} else if (tagName) {
			if (frames.length < 2 || frames[frames.length - 1].name !== tagName) {
				throw new Error(`Mismatched translation template tag: ${tagName}`);
			}

			const completedFrame = frames[frames.length - 1];
			frames.length -= 1;
			const parentFrame = frames[frames.length - 1];
			const formatter = replacements[tagName];

			if (typeof formatter !== "function") {
				missingValue(tagName);
			}

			parentFrame.children.push(formatter(completedFrame.children));
		}

		textIndex = matchIndex + match[0].length;
	}

	if (frames.length !== 1) {
		throw new Error(`Unclosed translation template tag: ${frames[frames.length - 1]?.name}`);
	}

	if (textIndex < input.length) {
		frames[0].children.push(input.slice(textIndex));
	}

	return frames[0].children;
}

/**
 * Formats a translated message containing named `{value}` placeholders.
 * Primitive values produce a string. JSX values or `<tag>content</tag>`
 * formatters produce a Solid JSX element without parsing or injecting HTML.
 */
export function formatMessage<
	Input extends string,
	Values extends MessageValues<Input>
>(input: Input, values: Values): MessageResult<Values>;
export function formatMessage(
	input: string,
	values: Record<string, MessageValue>
): JSX.Element | string {
	const rich = MESSAGE_RICH_TAG_PATTERN.test(input) || Object.values(values).some(value => (
		typeof value !== "number" && typeof value !== "string"
	));

	return rich
		? formatRichMessage(input, values)
		: formatPlainMessage(input, values);
}
