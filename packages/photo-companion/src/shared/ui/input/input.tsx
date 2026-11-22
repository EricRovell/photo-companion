import { omit } from "solid-js";
import { setAttribute } from "utils";

import type { JSX } from "@solidjs/web";

import type { Classes } from "../../types";

import styles from "./input.module.css";

export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class"> {
	classes?: Classes<"input" | "label" | "root">;
	error?: boolean;
	label?: string;
}

export function Input(props: InputProps) {
	const rest = omit(props, "classes", "children", "error");

	return (
		<label class={[ styles.root, props.classes?.root ]}>
			<span class={[ styles.label, props.classes?.label ]}>
				{props.children}
			</span>
			<input
				class={[ styles.input, props.classes?.input ]}
				data-error={setAttribute(props.error)}
				type="text"
				{...rest}
			/>
		</label>
	);
}
