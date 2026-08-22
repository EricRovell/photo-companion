import { For } from "solid-js";

import { IconChevronDown } from "~/shared/ui/icons";

import { DATETIME_CONFIG } from "../../model/config";

import type { DateTimeStep, InputDatetimeLabels } from "../../types";

import styles from "./datetime-step-select.module.css";

interface DatetimeStepSelectProps {
	disabled: boolean;
	labels: InputDatetimeLabels;
	onChange: (event: { currentTarget: HTMLSelectElement; target: Element } & Event) => void;
	step: DateTimeStep;
}

export function DatetimeStepSelect(props: DatetimeStepSelectProps) {
	return (
		<label class={styles["step-control"]}>
			<span class={styles["visually-hidden"]}>{props.labels.DATETIME_STEP}</span>
			<select
				aria-label={props.labels.DATETIME_STEP}
				class={styles.select}
				disabled={props.disabled}
				onChange={event => props.onChange(event)}
				value={props.step}
			>
				<For each={DATETIME_CONFIG.steps}>
					{option => (
						<option value={option}>
							{props.labels[option.toUpperCase() as Uppercase<DateTimeStep>]}
						</option>
					)}
				</For>
			</select>
			<IconChevronDown class={styles["select-icon"]} />
		</label>
	);
}
