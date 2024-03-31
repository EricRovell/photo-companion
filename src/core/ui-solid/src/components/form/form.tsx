import { Show, splitProps } from "solid-js";
import { classnames } from "utils";

import type { FieldsetProps, FormProps } from "./form.types";
import styles from "./form.module.css";

export function Form(allProps: FormProps) {
	const [ props, rest ] = splitProps(allProps, [ "children", "class" ]);

	return (
		<form class={classnames(styles.button, props.class)} {...rest}>
			{props.children}
		</form>
	);
}

export function Fieldset(allProps: FieldsetProps) {
	const [ props, rest ] = splitProps(allProps, [
		"children",
		"class",
		"legend"
	]);

	return (
		<fieldset class={classnames(styles.button, props.class)} {...rest}>
			<Show when={props.legend}>
				<legend>
					{props.legend}
				</legend>
			</Show>
			<div>
				{props.children}
			</div>
		</fieldset>
	);
}
