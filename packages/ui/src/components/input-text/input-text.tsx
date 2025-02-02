import { type JSX, splitProps  } from "solid-js";
import { classnames, setAttribute } from "utils";

import type { Classes } from "../../types";

import styles from "./input-text.module.css";

export interface InputTextProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class"> {
	classes?: Classes<"input" | "label" | "root">;
	error?: boolean;
	label?: string;
}

export function InputText(allProps: InputTextProps) {
	const [ props, rest ] = splitProps(allProps, [ "classes", "children", "error" ]);

	return (
		<label class={classnames(styles.root, props.classes?.root)}>
			<span class={classnames(styles.label, props.classes?.label)}>
				{props.children}
			</span>
			<input
				class={classnames(styles.input, props.classes?.input)}
				data-error={setAttribute(props.error)}
				type="text"
				{...rest}
			/>
		</label>
	);
}
