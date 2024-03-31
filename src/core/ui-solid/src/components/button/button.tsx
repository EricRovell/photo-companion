import { mergeProps, splitProps } from "solid-js";
import { classnames } from "utils";

import type { ButtonProps } from "./button.types";
import styles from "./button.module.css";

const DEFAULT_PROPS: ButtonProps = {
	appearance: "fill"
};

export function Button(allProps: ButtonProps) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [
		"appearance",
		"children",
		"class",
		"variant"
	]);

	return (
		<button
			class={classnames(styles.button, props.class)}
			data-appearance={props.appearance}
			data-variant={props.variant}
			{...rest}
		>
			{props.children}
		</button>
	);
}
