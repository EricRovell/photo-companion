import { splitProps  } from "solid-js";
import { classnames } from "utils";

import type { InputTextProps } from "./input-text.types";
import styles from "./input-text.module.css";

export function InputText(allProps: InputTextProps) {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<label class={classnames(styles.label, props.class)}>
			{props.children}
			<input
				class="{styles.input}"
				type="text"
				{...rest}
			/>
		</label>
	);
}
