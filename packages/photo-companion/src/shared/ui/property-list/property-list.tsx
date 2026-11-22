import { merge, omit, type ParentProps } from "solid-js";

import type { JSX } from "@solidjs/web";

import { Card } from "../card";
import { Text, type TextProps } from "../text/text";

import styles from "./property-list.module.css";

type PropertyTextProps<T extends "dd" | "dt" | "header"> = Omit<TextProps<T>, "as">;

export const PropertyList = (props: ParentProps<JSX.HTMLAttributes<HTMLElement>>) => {
	const rest = omit(props, "class", "children");

	return (
		<Card
			as="article"
			class={[ styles.card, props.class ]}
			{...rest}
		>
			{props.children}
		</Card>
	);
};

export const Header = (allProps: PropertyTextProps<"header">) => {
	const props = merge({ variant: "heading-m" as const }, allProps);
	const rest = omit(props, "class");

	return (
		<Text as="header" class={props.class} {...rest} />
	);
};

export const Body = (props: ParentProps<JSX.HTMLAttributes<HTMLDListElement>>) => {
	const rest = omit(props, "class", "children");

	return (
		<dl class={[ props.class ]} {...rest}>
			{props.children}
		</dl>
	);
};

export const Item = (props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) => {
	const rest = omit(props, "class", "children");

	return (
		<div class={[ styles.item, props.class ]} {...rest}>
			{props.children}
		</div>
	);
};

export const Label = (allProps: PropertyTextProps<"dt">) => {
	const props = merge({ variant: "text-s" as const }, allProps);
	const rest = omit(props, "class");

	return (
		<Text
			as="dt"
			class={[ styles.label, props.class ]}
			{...rest}
		/>
	);
};

export const Value = (allProps: PropertyTextProps<"dd">) => {
	const props = merge({
		numeric: true,
		variant: "text-s" as const
	}, allProps);

	const rest = omit(props, "class");

	return (
		<Text
			as="dd"
			class={[ styles.value, props.class ]}
			{...rest}
		/>
	);
};
