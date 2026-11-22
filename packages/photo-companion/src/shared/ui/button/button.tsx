import { merge, omit } from "solid-js";
import { setAttribute } from "utils";

import type { JSX } from "@solidjs/web";

import styles from "./button.module.css";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	appearance?: "fill" | "ghost" | "outline";
	icon?: boolean;
	pending?: boolean;
	variant?: Nullable<"danger" | "success">;
}

const DEFAULT_PROPS: ButtonProps = {
	appearance: "fill",
	pending: false,
	type: "button"
};

export function Button(allProps: ButtonProps) {
	const props = merge(DEFAULT_PROPS, allProps);
	const rest = omit(props, "appearance",
		"children",
		"class",
		"icon",
		"pending",
		"variant"
	);

	return (
		<button
			class={[ styles.button, props.class ]}
			data-appearance={props.appearance}
			data-icon={setAttribute(props.icon)}
			data-pending={setAttribute(props.pending)}
			data-variant={props.variant}
			{...rest}
		>
			{props.children}
		</button>
	);
}
