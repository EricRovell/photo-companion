import { createEffect, createSignal, For, mergeProps } from "solid-js";
import { InputCheckbox, type InputSelectOption } from "ui-solid";

import { setAttribute } from "@lib/helpers";

import styles from "./input-checkbox-group.module.css";

export type Value = Nullish<string[]>;
export type ChangeHandler = (name: string, value: Value) => void;

interface Props {
	disabled?: boolean;
	groupLabel: string;
	groupValue: string;
	name: string;
	onChange?: ChangeHandler;
	options: InputSelectOption[];
	value: Value;
}

const DEFAULT_PROPS = {
	options: []
};

const DiscloseIcon = () => (
	<svg viewBox="0 0 24 24">
		<polygon points="21.11 5.5 12 15.72 2.89 5.5 2 7.28 12 18.5 22 7.28 21.11 5.5" />
	</svg>
);

const CheckboxList = (props: Props) => (
	<ul>
		<For each={props.options}>
			{(option) => (
				<li>
					<InputCheckbox
						checked={!props.value || props.value.includes(option.value)}
						data-group={props.groupValue}
						disabled={props.disabled}
						label={option.label}
						name={props.name}
						symbolChecked={null}
						symbolUnchecked="CHECK"
						type="checkbox"
						value={option.value}
					/>
				</li>
			)}
		</For>
	</ul>
);

function RootCheckbox(props: Props) {
	const indeterminate = () => (
		props.value &&
		props.value.length !== 0 &&
		props.value.length < props.options.length
	);

	return (
		<InputCheckbox
			checked={!props.value}
			data-group={props.groupValue}
			data-root
			disabled={props.disabled}
			indeterminate={indeterminate()}
			label={props.groupLabel}
			name={props.name}
			symbolChecked={null}
			symbolUnchecked="CHECK"
			type="checkbox"
			value={props.groupValue}
		/>
	);
}

/**
 * Note: The checkbox state is reversed visually for the user.
 * 
 * This checkbox group behaves like a disallow list under the hood,
 * knowing which events are NOT allowed makes code easier,
 * as for allow list we should not all possible events ahead.
 */
export function InputCheckboxGroup(allProps: Props) {
	const props = mergeProps(DEFAULT_PROPS, allProps);

	// eslint-disable-next-line solid/reactivity
	const [ getValue, setValue ] = createSignal<Value>(props.value);

	createEffect(() => {
		setValue(props.value);
	});

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const isRoot = target.hasAttribute("data-root");
	
		if (isRoot) {
			setValue(target.checked ? null : []);
			props.onChange?.(props.name, getValue());

			return;
		}
	
		if (target.checked && !getValue()) {
			setValue([]);
		}
	
		if (!target.checked && !getValue()) {
			setValue(props.options.map(option => option.value));
		}
	
		if (target.checked) {
			// @ts-expect-error: value is set above
			setValue(value => [ ...value, target.value ]);
		} else {
			// @ts-expect-error: value is set above
			setValue(value => value.filter(item => item !== target.value));
		}
	
		if (Array.isArray(getValue()) && getValue()?.length === props.options.length) {
			setValue(null);
		}

		props.onChange?.(props.name, getValue());
	};
	
	return (
		<fieldset
			class={styles["checkbox-group"]}
			onChange={handleChange}
		>
			<details data-disabled={setAttribute(props.disabled)}>
				<summary>
					<DiscloseIcon />
					<RootCheckbox {...props} value={getValue()} />
				</summary>
				<CheckboxList {...props} value={getValue()} />
			</details>
		</fieldset>
	);
}
