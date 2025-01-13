import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import styles from "./time.module.css";

type TimeProps = JSX.TimeHTMLAttributes<HTMLElement>;

export function Time(allProps: TimeProps) {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<time class={classnames(styles.time, props.class)} {...rest}>
			{props.children}
		</time>
	);
}
