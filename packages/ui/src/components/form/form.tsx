import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import styles from "./form.module.css";

type FormProps = JSX.HTMLAttributes<HTMLFormElement>;

export function Form(allProps: FormProps) {
	const [ props, rest ] = splitProps(allProps, [ "children", "class" ]);

	return (
		<form class={classnames(styles.form, props.class)} {...rest}>
			{props.children}
		</form>
	);
}
