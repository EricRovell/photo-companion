import { omit } from "solid-js";
import { Show } from "solid-js";

import type { JSX } from "@solidjs/web";

import { Card } from "../card";

import type { Classes } from "../../types";

import styles from "./form.module.css";

interface FieldsetProps extends Omit<JSX.HTMLAttributes<HTMLFieldSetElement>, "class"> {
	classes?: Classes<"content" | "fieldset" | "legend">;
	legend?: string;
}

export function Fieldset(props: FieldsetProps) {
	const rest = omit(props, "children",
		"classes",
		"legend"
	);

	return (
		<Card>
			<fieldset
				class={[ styles.fieldset, props.classes?.fieldset ]}
				{...rest}
			>
				<Show when={props.legend}>
					<legend class={props.classes?.legend}>
						{props.legend}
					</legend>
				</Show>
				<div class={props.classes?.content}>
					{props.children}
				</div>
			</fieldset>
		</Card>
	);
}

export function Form(props: JSX.HTMLAttributes<HTMLFormElement>) {
	const rest = omit(props, "children", "class");

	return (
		<form class={[ styles.form, props.class ]} {...rest}>
			{props.children}
		</form>
	);
}
