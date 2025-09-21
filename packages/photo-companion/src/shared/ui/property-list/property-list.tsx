import { type ParentProps, splitProps } from "solid-js";
import { classnames } from "utils";

import type { JSX} from "solid-js";

import styles from "./property-list.module.css";

export const PropertyList = (allProps: ParentProps<JSX.HTMLAttributes<HTMLElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<article class={classnames(styles.card, props.class)} {...rest}>
			{props.children}
		</article>
	);
};

export const Header = (allProps: ParentProps<JSX.HTMLAttributes<HTMLElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<header class={classnames(styles.header, props.class)} {...rest}>
			{props.children}
		</header>
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

export const Label = (allProps: ParentProps<JSX.HTMLAttributes<HTMLElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<dt class={classnames(props.class)} {...rest}>
			{props.children}
		</dt>
	);
};

export const Value = (allProps: ParentProps<JSX.HTMLAttributes<HTMLElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<dd class={classnames(styles.value, props.class)} {...rest}>
			{props.children}
		</dd>
	);
};
