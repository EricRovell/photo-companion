import { type JSX, splitProps  } from "solid-js";
import { classnames } from "utils";

import type { Classes } from "../../types";

import styles from "./input-text.module.css";

export interface InputTextProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class"> {
	classes?: Classes<"input" | "label">;
	label?: string;
}

export function InputText(allProps: InputTextProps) {
	const [ props, rest ] = splitProps(allProps, [ "classes", "children" ]);

	return (
		<label class={classnames(styles.label, props.classes?.label)}>
			{props.children}
			<input
				class={classnames(styles.input, props.classes?.input)}
				type="text"
				{...rest}
			/>
		</label>
	);
}
