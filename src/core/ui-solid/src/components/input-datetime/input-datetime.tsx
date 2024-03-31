import { classnames } from "utils";
import { incrementDateByDay } from "utils/date";
import { createSignal, splitProps } from "solid-js";

import { getDatetimeString } from "./input-datetime.helpers";
import { iconTimeline, iconChevronLeft, iconChevronRight } from "../../icons";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";
import type { InputDatetimeProps, IncrementDateButtonProps } from "./input-datetime.types";
import styles from "./input-datetime.module.css";

function IncrementDayButton(allProps: IncrementDateButtonProps) {
	const [ props, rest ] = splitProps(allProps, [ "iconPath", "step" ]);

	return (
		<Button
			class={styles["button-increment"]}
			data-step={props.step}
			{...rest}
		>
			<Icon
				viewBox="0 0 256 256"
				path={props.iconPath}
			/>
		</Button>
	);
}

export function InputDatetime(allProps: InputDatetimeProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"dict",
		"onChange"
	]);

	const [ value, setValue ] = createSignal<string>(getDatetimeString());

	const handleReset = () => {
		setValue(getDatetimeString());
	};

	const handleClick = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const step = Number(target.dataset.step);
		const nextValue = getDatetimeString(incrementDateByDay(value(), step));
		setValue(nextValue);
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		setValue(target.value);
		//props.onChange?.(value());
	};

	return (
		<form
			class={classnames(styles.form, props.class)}
			onSubmit={(event: SubmitEvent) => event.preventDefault()}
		>
			<IncrementDayButton
				iconPath={iconChevronLeft}
				onClick={handleClick}
				step={-1}
				title={props.dict.PREVIOUS_DAY}
			/>
			<div>
				<label>
					{props.children}
					<input
						aria-label={props.dict.DATETIME}
						class={styles.input}
						onChange={handleChange}
						type="datetime-local"
						{...rest}
					/>
				</label>
				<Button
					class={styles.button}
					onClick={handleReset}
					title={props.dict.NOW}
				>
					<Icon path={iconTimeline} />
				</Button>
			</div>
			<IncrementDayButton
				iconPath={iconChevronRight}
				onClick={handleClick}
				step={1}
				title={props.dict.NEXT_DAY}
			/>
		</form>
	);
}
