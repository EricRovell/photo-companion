import { createEffect, mergeProps, Show, splitProps  } from "solid-js";
import { classnames } from "utils";

import type { JSX } from "solid-js";

import type { Classes } from "../../types";

import styles from "./input-checkbox.module.css";

type SymbolType = Nullish<"CHECK" | "CROSS" | "MINUS">;

interface CheckboxIconProps {
	class?: string;
	symbolChecked?: SymbolType;
	symbolIndeterminate?: SymbolType;
	symbolUnchecked?: SymbolType;
}

interface InputCheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class">, CheckboxIconProps {
	classes?: Classes<"icon" | "input" | "label" | "title">;
	indeterminate?: Nullable<boolean>;
	label?: string;
	ref?: HTMLInputElement;
}

const DEFAULT_PROPS: InputCheckboxProps = {
	symbolChecked: "CHECK",
	symbolIndeterminate: "MINUS"
};

const ICON_PATH = {
	CHECK : "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
	CROSS: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
	MINUS: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"
};

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
