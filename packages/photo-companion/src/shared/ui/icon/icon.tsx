import { merge, omit, type ParentProps, Show } from "solid-js";

import type { JSX } from "@solidjs/web";

import styles from "./icon.module.css";

export interface IconProps extends ParentProps<JSX.SvgSVGAttributes<SVGSVGElement>> {
	title?: string;
	viewBox?: string;
}

const DEFAULT_PROPS: Omit<IconProps, "path"> = {
	viewBox: "0 0 256 256"
};

export function Icon(allProps: IconProps) {
	const props = merge(DEFAULT_PROPS, allProps);
	const rest = omit(props, "children", "class", "title");

	return (
		<svg
			aria-labelledby={props.title}
			class={[ styles.icon, props.class ]}
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
