import { For, omit } from "solid-js";

import type { JSX } from "@solidjs/web";

import type { Classes } from "../../types";

import styles from "./input-radio.module.css";

interface InputRadioOption {
	disabled?: boolean,
	label: string;
	selected?: boolean;
	value: string;
}

export interface InputRadioProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class"> {
	classes?: Classes<"indicator" | "input" | "label" | "root">;
	options: InputRadioOption[];
}

export function InputRadio(props: InputRadioProps) {
	const rest = omit(props, "classes",
		"children",
		"options",
		"value"
	);

	return (
		<For each={props.options} keyed={false}>
			{item => (
				<label class={[ styles.root, props.classes?.root ]}>
					<input
						checked={props.value === item().value}
						class={[ styles.radio, props.classes?.input ]}
						disabled={item().disabled}
						type="radio"
						value={item().value}
						{...rest}
					/>
					<span
						class={[ styles.indicator, props.classes?.indicator ]}
					/>
					<span class={[ styles.label, props.classes?.label ]}>
						{item().label}
					</span>
				</label>
			)}
		</For>
	);
}
