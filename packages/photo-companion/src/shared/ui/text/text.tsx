import { mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { classnames, setAttribute } from "utils";

import type { ComponentProps, JSX, ValidComponent } from "solid-js";

import styles from "./text.module.css";

export type TextAlign = "center" | "end" | "justify" | "start";
export type TextColor = "danger" | "inherit" | "primary" | "secondary" | "success";
export type TextLeading = "normal" | "relaxed" | "tight";
export type TextSize = "l" | "m" | "s" | "xl" | "xs";
export type HeadingSize = "2xl" | "3xl" | "4xl" | TextSize;
export type TextVariant = `heading-${HeadingSize}` | `text-${TextSize}`;

interface TextOwnProps<T extends ValidComponent> {
	align?: TextAlign;
	as?: T;
	balance?: boolean;
	class?: string;
	color?: TextColor;
	leading?: TextLeading;
	numeric?: boolean;
	variant?: TextVariant;
}

export type TextProps<T extends ValidComponent = "span"> = Omit<ComponentProps<T>, keyof TextOwnProps<T>>
	& TextOwnProps<T>;

const DEFAULT_PROPS = {
	as: "span",
	color: "inherit",
	numeric: false,
	variant: "text-m"
} as const;

const TextElement = Dynamic as (props: {
	component: ValidComponent;
} & Record<string, unknown>) => JSX.Element;

export function Text<T extends ValidComponent = "span">(allProps: TextProps<T>) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [
		"align",
		"as",
		"balance",
		"class",
		"color",
		"leading",
		"numeric",
		"variant"
	]);

	return (
		<TextElement
			class={classnames(styles.text, props.class)}
			component={props.as}
			data-align={props.align}
			data-balance={setAttribute(props.balance)}
			data-color={props.color}
			data-leading={props.leading}
			data-numeric={setAttribute(props.numeric)}
			data-variant={props.variant}
			{...rest}
		/>
	);
}
