import { Show, mergeProps, splitProps } from "solid-js";
import { classnames } from "utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";

const DEFAULT_PROPS: ButtonProps = {
	appearance: "fill",
	loading: false,
	type: "button"
};

export function Button(allProps: ButtonProps) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [
		"appearance",
		"children",
		"class",
		"loading",
		"variant"
	]);

	return (
		<button
			class={classnames(styles.button, props.class)}
			data-appearance={props.appearance}
			data-variant={props.variant}
			data-loading={props.loading ? "" : undefined}
			{...rest}
		>
			{props.children}
		</button>
	);
}
