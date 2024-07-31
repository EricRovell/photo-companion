import { Index, type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import type { Classes } from "../../types";

import styles from "./input-radio.module.css";

export interface InputRadioOption {
	disabled?: boolean,
	label: string;
	selected?: boolean;
	value: string;
}

export interface InputRadioProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class"> {
	classes?: Classes<"indicator" | "input" | "label">;
	options: InputRadioOption[];
}

export function InputRadio(allProps: InputRadioProps) {
	const [ props, rest ] = splitProps(allProps, [
		"classes",
		"children",
		"options",
		"value"
	]);

	return (
		<Index each={props.options}>
			{item => (
				<label class={classnames(styles.label, props.classes?.label)}>
					<input
						checked={props.value === item().value}
						class={classnames(styles.radio, props.classes?.input)}
						disabled={item().disabled}
						type="radio"
						value={item().value}
						{...rest}
					/>
					<span class={props.classes?.indicator} />
					{item().label}
				</label>
			)}
		</Index>
	);
}
