import { splitProps, Index } from "solid-js";
import { classnames } from "utils";

import type { InputRadioProps } from "./input-radio.types";
import styles from "./input-radio.module.css";

export function InputRadio(allProps: InputRadioProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"options",
		"value"
	]);

	return (
		<Index each={props.options}>
			{item => (
				<label class={classnames(styles.label, props.class)}>
					<input
						class={styles.radio}
						checked={props.value === item().value}
						disabled={item().disabled}
						type="radio"
						value={item().value}
						{...rest}
					/>
					<span />
					{item().label}
				</label>
			)}
		</Index>
	);
}
