import { createMemo, splitProps } from "solid-js";
import { classnames } from "utils";

import { DATETIME_CONFIG } from "../../model/config";
import { createInputDatetimeModel } from "../../model/create-input-datetime-model";
import { DatetimeActions } from "../datetime-actions/datetime-actions";
import { DatetimeStepSelect } from "../datetime-step-select/datetime-step-select";
import { DatetimeTimeline } from "../datetime-timeline/datetime-timeline";

import type { InputDatetimeProps } from "../../types";

import styles from "./input-datetime.module.css";

export function InputDatetime(allProps: InputDatetimeProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"disabled",
		"labels",
		"locale",
		"onChange",
		"onDatetimeChange",
		"onReset",
		"value"
	]);

	const labels = createMemo(() => ({ ...DATETIME_CONFIG.defaultLabels, ...props.labels }));

	const model = createInputDatetimeModel({
		disabled: () => Boolean(props.disabled),
		locale: () => props.locale ?? "en",
		onDatetimeChange: () => props.onDatetimeChange,
		onReset: () => props.onReset,
		value: () => props.value
	});

	return (
		<form class={classnames(styles.form, props.class)} onSubmit={event => event.preventDefault()}>
			<DatetimeStepSelect
				disabled={Boolean(props.disabled)}
				labels={labels()}
				onChange={model.handleStepChange}
				step={model.step()}
			/>
			<DatetimeTimeline
				disabled={Boolean(props.disabled)}
				label={labels().DATETIME_TIMELINE}
				model={model}
			/>
			<DatetimeActions
				disabled={Boolean(props.disabled)}
				inputProps={rest}
				labels={labels()}
				model={model}
				value={props.value}
			/>
		</form>
	);
}
