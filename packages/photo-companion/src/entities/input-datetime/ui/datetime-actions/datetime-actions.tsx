import type { JSX } from "solid-js";

import { Button } from "~/shared/ui";
import { IconCalendar, IconTimeline } from "~/shared/ui/icons";

import type { InputDatetimeModel } from "../../model/create-input-datetime-model";
import type { InputDatetimeLabels, InputDatetimeProps } from "../../types";

import styles from "./datetime-actions.module.css";

interface DatetimeActionsProps {
	disabled: boolean;
	inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
	labels: InputDatetimeLabels;
	model: InputDatetimeModel;
	value: InputDatetimeProps["value"];
}

export function DatetimeActions(props: DatetimeActionsProps) {
	return (
		<div class={styles.actions}>
			<div class={styles["picker-control"]}>
				<input
					{...props.inputProps}
					aria-label={props.labels.DATETIME}
					class={styles.input}
					disabled={props.disabled}
					onChange={event => props.model.handlePickerChange(event)}
					ref={props.model.setInputRef}
					step={1}
					tabIndex={-1}
					type="datetime-local"
					value={typeof props.value === "string" ? props.value : undefined}
				/>
				<Button
					aria-label={props.labels.OPEN_DATETIME_PICKER}
					class={styles.button}
					disabled={props.disabled}
					icon
					onClick={props.model.handleOpenPicker}
					title={props.labels.OPEN_DATETIME_PICKER}
				>
					<IconCalendar />
				</Button>
			</div>
			<Button
				aria-label={props.labels.NOW}
				class={styles.button}
				disabled={props.disabled}
				icon
				onClick={props.model.handleReset}
				title={props.labels.NOW}
			>
				<IconTimeline />
			</Button>
		</div>
	);
}
