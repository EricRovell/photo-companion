import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { classnames } from "utils";

import type { ComponentProps, JSX, ParentProps, ValidComponent } from "solid-js";

import styles from "./card.module.css";

interface CardOwnProps<T extends ValidComponent> {
	as?: T;
	children?: JSX.Element;
	class?: string;
}

export type CardProps<T extends ValidComponent = "section"> = CardOwnProps<T>
	& Omit<ComponentProps<T>, keyof CardOwnProps<T>>;

const CardElement = Dynamic as (props: {
	component: ValidComponent;
} & Record<string, unknown>) => JSX.Element;

export function Card<T extends ValidComponent = "section">(allProps: CardProps<T>) {
	const [ props, rest ] = splitProps(allProps, [ "as", "children", "class" ]);

	return (
		<CardElement
			class={classnames(styles.card, props.class)}
			component={props.as ?? "section"}
			{...rest}
		>
			{props.children}
		</CardElement>
	);
}

export function Header(allProps: ParentProps<JSX.HTMLAttributes<HTMLElement>>) {
	return <header {...allProps} />;
}
