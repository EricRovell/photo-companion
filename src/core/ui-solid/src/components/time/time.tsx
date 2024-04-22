import { splitProps } from "solid-js";
import { classnames } from "utils";

import type { TimeProps } from "./time.types";
import styles from "./time.module.css";

export function Time(allProps: TimeProps) {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<time class={classnames(styles.time, props.class)} {...rest}>
			{props.children}
		</time>
	);
}
