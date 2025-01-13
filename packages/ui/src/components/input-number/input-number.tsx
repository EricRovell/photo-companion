import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import type { Classes } from "../../types";

import styles from "./input-number.module.css";

export interface InputNumberProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class"> {
	classes?: Classes<"input" | "label">;
}

export function InputNumber(allProps: InputNumberProps) {
	const [ props, rest ] = splitProps(allProps, [
		"classes",
		"children"
	]);

	return (
		<label class={classnames(styles.label, props.classes?.label)}>
			{props.children}
			<input
				class={classnames(styles.input, props.classes?.input)}
				type="number"
				{...rest}
			/>
		</label>
	);
}
