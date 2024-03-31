import { splitProps, For } from "solid-js";
import { classnames } from "utils";

import type { InputSelectProps } from "./input-select.types";
import styles from "./icon.module.css";

export function InputSelect(allProps: InputSelectProps) {
	const [ props, rest ] = splitProps(allProps, [ "class", "children", "options" ]);

	return (
		<label class={classnames(styles.label, props.class)}>
			{props.children}
			<select class={styles.select} {...rest}>
				<For each={props.options}>
					{({ label, ...other }) => (
						<option {...other}>
							{label}
						</option>
					)}
				</For>
			</select>
		</label>
	);
}
