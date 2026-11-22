import { dynamic } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { setAttribute } from "utils";

import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";

import styles from "./text.module.css";

type TextAlign = "center" | "end" | "justify" | "start";
type TextColor = "danger" | "inherit" | "primary" | "secondary" | "success";
type TextLeading = "normal" | "relaxed" | "tight";
type TextSize = "l" | "m" | "s" | "xl" | "xs";
type HeadingSize = "2xl" | "3xl" | "4xl" | TextSize;
export type TextVariant = `heading-${HeadingSize}` | `text-${TextSize}`;

interface TextOwnProps<T extends ValidComponent> {
	align?: TextAlign;
	as?: T;
	balance?: boolean;
	class?: JSX.HTMLAttributes<HTMLElement>["class"];
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


export function Text<T extends ValidComponent = "span">(allProps: TextProps<T>) {
	const props = merge(DEFAULT_PROPS, allProps);
	const rest = omit(props, "align",
		"as",
		"balance",
		"class",
		"color",
		"leading",
		"numeric",
		"variant"
	);

	const TextElement = dynamic(() => props.as) as (props: Record<string, unknown>) => JSX.Element;

	return (
		<TextElement
			class={[ styles.text, props.class ]}
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
