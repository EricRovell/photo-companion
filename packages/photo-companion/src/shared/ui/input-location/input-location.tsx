import { createSignal, Show, splitProps } from "solid-js";

import type { JSX, ParentProps } from "solid-js";
import type { Degrees } from "utils/math";

import { Input } from "../input/input";

import styles from "./input-location.module.css";

interface Props extends ParentProps, Omit<JSX.HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
	/**
	 * Should the value have sign?
	 */
	abs?: boolean;
	error?: boolean;
	labels?: {
		degrees: string;
		minutes: string;
		seconds: string;
	};
	legend?: string;
	name: string;
	onChange?: (value: Degrees) => void;
	required?: boolean;
	value?: Degrees;
}

export function InputLocation(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [
		"abs",
		"children",
		"name",
		"onChange",
		"legend",
		"labels",
		"value",
		"required",
		"error"
	]);

	const [ refDegrees, setRefDegrees ] = createSignal<HTMLInputElement>();
	const [ refMinutes, setRefMinutes ] = createSignal<HTMLInputElement>();
	const [ refSeconds, setRefSeconds ] = createSignal<HTMLInputElement>();

	const handleChange = () => {
		props.onChange?.([
			refDegrees()?.valueAsNumber ?? 0,
			refMinutes()?.valueAsNumber ?? 0,
			refSeconds()?.valueAsNumber ?? 0
		]);
	};

	return (
		<fieldset class={styles.fieldset} onChange={handleChange} {...rest}>
			<Show when={props.legend}>
				<legend class={styles.legend}>
					{props.legend}
				</legend>
			</Show>
			<Input
				classes={{
					label: styles.label
				}}
				error={props.error}
				max={90}
				min={props.abs ? 0 : -90}
				name={`${props.name}-degrees`}
				ref={setRefDegrees}
				required={props.required}
				step={1}
				type="number"
				value={props.value?.[0] ?? 0}
			>
				{props.labels?.degrees ?? "Degrees"}
			</Input>
			<Input
				classes={{
					label: styles.label
				}}
				error={props.error}
				max={59}
				min={0}
				name={`${props.name}-minutes`}
				ref={setRefMinutes}
				required={props.required}
				step={1}
				type="number"
				value={props.value?.[1] ?? 0}
			>
				{props.labels?.minutes ?? "Minutes"}
			</Input>
			<Input
				classes={{
					label: styles.label
				}}
				error={props.error}
				max={59}
				min={0}
				name={`${props.name}-seconds`}
				ref={setRefSeconds}
				required={props.required}
				step={1}
				type="number"
				value={props.value?.[2] ?? 0}
			>
				{props.labels?.seconds ?? "Seconds"}
			</Input>
			{props.children}
		</fieldset>
	);
}
