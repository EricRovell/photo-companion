import { createMemo, createSignal, Show, splitProps } from "solid-js";
import { Input } from "ui";
import { isNullable } from "utils/validators";

import type { JSX, ParentProps } from "solid-js";

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
	onChange?: (value: number) => void;
	required?: boolean;
	value?: number;
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

	const initialValue = createMemo(() => {
		if (isNullable(props.value) || Number.isNaN(props.value)) {
			return {
				degrees: 0,
				minutes: 0,
				seconds: 0
			};
		}

		const degrees = Math.trunc(props.value);
		const frac = (props.value - degrees) * 60;

		const minutes = Math.trunc(frac);
		const seconds = Math.trunc((frac - minutes) * 60);

		return {
			degrees,
			minutes,
			seconds
		};
	});

	const [ refDegrees, setRefDegrees ] = createSignal<HTMLInputElement>();
	const [ refMinutes, setRefMinutes ] = createSignal<HTMLInputElement>();
	const [ refSeconds, setRefSeconds ] = createSignal<HTMLInputElement>();

	const handleChange = () => {
		const degrees = refDegrees()?.valueAsNumber ?? 0;
		const minutes = refMinutes()?.valueAsNumber ?? 0;
		const seconds = refSeconds()?.valueAsNumber ?? 0;

		const value = Math.round(degrees) + Math.round(minutes) / 60 + Math.round(seconds) / 3600;

		props.onChange?.(Number.isNaN(value) ? 0 : value);
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
				value={initialValue().degrees}
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
				value={initialValue().minutes}
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
				value={initialValue().seconds}
			>
				{props.labels?.seconds ?? "Seconds"}
			</Input>
			{props.children}
		</fieldset>
	);
}
