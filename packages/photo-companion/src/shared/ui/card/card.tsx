import { dynamic } from "@solidjs/web";
import { omit } from "solid-js";

import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import type { ParentProps } from "solid-js";

import styles from "./card.module.css";

interface CardOwnProps<T extends ValidComponent> {
	as?: T;
	children?: JSX.Element;
	class?: JSX.HTMLAttributes<HTMLElement>["class"];
}

export type CardProps<T extends ValidComponent = "section"> = CardOwnProps<T>
	& Omit<ComponentProps<T>, keyof CardOwnProps<T>>;


export function Card<T extends ValidComponent = "section">(props: CardProps<T>) {
	const rest = omit(props, "as", "children", "class");
	const CardElement = dynamic(() => props.as ?? "section");

	return (
		<CardElement
			class={[ styles.card, props.class ]}
			{...rest}
		>
			{props.children}
		</CardElement>
	);
}

export function Header(props: ParentProps<JSX.HTMLAttributes<HTMLElement>>) {
	return <header {...props} />;
}
