import { mergeProps, type ParentProps, splitProps } from "solid-js";
import { classnames } from "utils";

import type { JSX} from "solid-js";

import { Card } from "../card";
import { Text, type TextProps } from "../text/text";

import styles from "./property-list.module.css";

type PropertyTextProps<T extends "dd" | "dt" | "header"> = Omit<TextProps<T>, "as">;

export const PropertyList = (allProps: ParentProps<JSX.HTMLAttributes<HTMLElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<Card as="article" class={classnames(styles.card, props.class)} {...rest}>
			{props.children}
		</Card>
	);
};

export const Header = (allProps: PropertyTextProps<"header">) => {
	const mergedProps = mergeProps({ variant: "heading-m" as const }, allProps);
	const [ props, rest ] = splitProps(mergedProps, [ "class" ]);

	return (
		<Text as="header" class={props.class} {...rest} />
	);
};

export const Body = (allProps: ParentProps<JSX.HTMLAttributes<HTMLDListElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<dl class={classnames(props.class)} {...rest}>
			{props.children}
		</dl>
	);
};

export const Item = (allProps: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<div class={classnames(styles.item, props.class)} {...rest}>
			{props.children}
		</div>
	);
};

export const Label = (allProps: PropertyTextProps<"dt">) => {
	const mergedProps = mergeProps({ variant: "text-s" as const }, allProps);
	const [ props, rest ] = splitProps(mergedProps, [ "class" ]);

	return (
		<Text as="dt" class={classnames(styles.label, props.class)} {...rest} />
	);
};

export const Value = (allProps: PropertyTextProps<"dd">) => {
	const mergedProps = mergeProps({ numeric: true, variant: "text-s" as const }, allProps);
	const [ props, rest ] = splitProps(mergedProps, [ "class" ]);

	return (
		<Text as="dd" class={classnames(styles.value, props.class)} {...rest} />
	);
};
