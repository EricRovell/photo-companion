import { mergeProps, splitProps } from "solid-js";
import { classnames, setAttribute } from "utils";

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
		"icon",
		"loading",
		"variant"
	]);

	return (
		<button
			class={classnames(styles.button, props.class)}
			data-appearance={props.appearance}
			data-icon={setAttribute(props.icon)}
			data-loading={setAttribute(props.loading)}
			data-variant={props.variant}
			{...rest}
		>
			{props.children}
		</button>
	);
}
