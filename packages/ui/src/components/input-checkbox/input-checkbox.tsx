import { createEffect, mergeProps, Show, splitProps  } from "solid-js";
import { classnames } from "utils";

import { DEFAULT_PROPS, ICON_PATH } from "./input-checkbox.consts";

import type { CheckboxIconProps, InputCheckboxProps } from "./input-checkbox.types";

import styles from "./input-checkbox.module.css";

function CheckboxIcon(props: CheckboxIconProps) {
	return (
		<svg class={classnames(styles.box, props.class)} viewBox="0 0 256 256">
			<Show when={props.symbolChecked}>
				{item => <path d={ICON_PATH[item()]} data-checked />}
			</Show>
			<Show when={props.symbolUnchecked}>
				{item => <path d={ICON_PATH[item()]} data-unchecked />}
			</Show>
			<Show when={props.symbolIndeterminate}>
				{item => <path d={ICON_PATH[item()]} data-indeterminate />}
			</Show>
		</svg>
	);
}

export function InputCheckbox(allProps: InputCheckboxProps) {
	const merged = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, symbols, rest ] = splitProps(merged,
		[
			"checked",
			"classes",
			"indeterminate",
			"label"
		],
		[
			"symbolChecked",
			"symbolUnchecked",
			"symbolIndeterminate"
		]
	);

	let inputRef: HTMLInputElement;

	const indeterminate = () => Boolean(!props.checked && props.indeterminate);
	const checked = () => !props.indeterminate && props.checked;

	createEffect(() => {
		inputRef.indeterminate = indeterminate();
	});

	return (
		<label class={classnames(styles.label, props.classes?.label)}>
			<input
				checked={checked()}
				class={classnames(styles.input, props.classes?.input)}
				ref={el => inputRef = el}
				type="checkbox"
				{...rest}
			/>
			<CheckboxIcon class={props.classes?.icon} {...symbols} />
			<Show when={props.label}>
				{label => <span class={props.classes?.title}>{label()}</span>}
			</Show>
		</label>
	);
}
