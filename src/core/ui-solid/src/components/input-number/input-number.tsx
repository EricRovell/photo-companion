import { splitProps } from "solid-js";
import { classnames } from "utils";

import type { InputNumberProps } from "./input-number.types";
import styles from "./input-number.module.css";

export function InputNumber(allProps: InputNumberProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children"
	]);

	return (
		<label class={classnames(styles.label, props.class)}>
			{props.children}
			<input
				class={styles.input}
				type="number"
				{...rest}
			/>
		</label>
	);
}
