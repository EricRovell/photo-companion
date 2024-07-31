import { type JSX, Show, splitProps } from "solid-js";
import { classnames } from "utils";

import type { Classes } from "../../types";

import styles from "./form.module.css";

interface FieldsetProps extends Omit<JSX.HTMLAttributes<HTMLFieldSetElement>, "class"> {
	classes?: Classes<"content" | "fieldset" | "legend">;
	legend?: string;
}

export function Fieldset(allProps: FieldsetProps) {
	const [ props, rest ] = splitProps(allProps, [
		"children",
		"classes",
		"legend"
	]);

	return (
		<fieldset class={classnames(styles.fieldset, props.classes?.fieldset)} {...rest}>
			<Show when={props.legend}>
				<legend class={props.classes?.legend}>
					{props.legend}
				</legend>
			</Show>
			<div class={props.classes?.content}>
				{props.children}
			</div>
		</fieldset>
	);
}
