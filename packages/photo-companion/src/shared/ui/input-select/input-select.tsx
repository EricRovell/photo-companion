import { For, type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import type { Classes } from "../../types";

import styles from "./input-select.module.css";

export interface InputSelectOption {
	disabled?: boolean,
	label: string;
	selected?: boolean;
	value: string;
}

export interface InputSelectProps extends Omit<JSX.InputHTMLAttributes<HTMLSelectElement>, "class"> {
	classes?: Classes<"label" | "option" | "select">;
	label?: string;
	options: InputSelectOption[];
}

export function InputSelect(allProps: InputSelectProps) {
	const [ props, rest ] = splitProps(allProps, [ "classes", "children", "options" ]);

	return (
		<label class={classnames(styles.label, props.classes?.label)}>
			{props.children}
			<select class={classnames(styles.select, props.classes?.select)} {...rest}>
				<For each={props.options}>
					{({ label, ...other }) => (
						<option class={props.classes?.option} {...other}>
							{label}
						</option>
					)}
				</For>
			</select>
		</label>
	);
}
