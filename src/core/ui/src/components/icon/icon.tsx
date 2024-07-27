import { mergeProps, Show, splitProps } from "solid-js";
import { classnames } from "utils";

import type { IconProps } from "./icon.types";

import styles from "./icon.module.css";

const DEFAULT_PROPS: Omit<IconProps, "path"> = {
	viewBox: "0 0 256 256"
};

export function Icon(allProps: IconProps) {
	const merged = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(merged, [ "children", "class", "title"]);

	return (
		<svg
			aria-labelledby={props.title}
			class={classnames(styles.icon, props.class)}
			role="presentation"
			{...rest}
		>
			<Show when={props.title}>
				<title>{props.title}</title>
			</Show>
			{props.children}
		</svg>
	);
}
