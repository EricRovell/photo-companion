import { splitProps } from "solid-js";
import { classnames } from "utils";
import { incrementDateByDay } from "utils/date";
import { isNullable } from "utils/validators";

import type { JSX } from "solid-js";

import { Button } from "../button/button";
import { IconChevronLeft, IconChevronRight, IconTimeline } from "../icon";

import styles from "./input-datetime.module.css";

export interface InputDatetimeProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	labels?: {
		DATETIME: string;
		NEXT_DAY: string;
		NOW: string;
		PREVIOUS_DAY: string;
	};
	onDatetimeChange?: (value: string) => void;
}

export function getDatetimeString(date = new Date()): string {
	const timezoneOffset = date.getTimezoneOffset() * 60000;
	return (new Date(date.getTime() - timezoneOffset)).toISOString().slice(0, 16);
}

export function InputDatetime(allProps: InputDatetimeProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"labels",
		"onChange",
		"onDatetimeChange"
	]);

	let inputRef: Undefinable<HTMLInputElement>;

	const handleReset = () => {
		props.onDatetimeChange?.(getDatetimeString());
	};

	const handleIncrement = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const step = Number(target.dataset.step);
		const value = inputRef?.value;

		if (!isNullable(value)) {
			const nextValue = getDatetimeString(incrementDateByDay(value, step));
			props.onDatetimeChange?.(nextValue);
		}
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		props.onDatetimeChange?.(target.value);
	};

	return (
		<form class={classnames(styles.form, props.class)}>
			<Button
				class={styles["button-increment"]}
				data-step={-1}
				onClick={handleIncrement}
				title={props.labels?.PREVIOUS_DAY ?? "Previous day"}
				type="button"
			>
				<IconChevronLeft />
			</Button>
			<div class={styles["input-wrapper"]}>
				<label class={styles.label}>
					{props.children}
					<input
						aria-label={props.labels?.DATETIME ?? "Date and time"}
						class={styles.input}
						onChange={handleChange}
						ref={inputRef}
						type="datetime-local"
						{...rest}
					/>
				</label>
				<Button
					class={styles.button}
					onClick={handleReset}
					title={props.labels?.NOW ?? "Now"}
					type="button"
				>
					<IconTimeline />
				</Button>
			</div>
			<Button
				class={styles["button-increment"]}
				data-step={1}
				onClick={handleIncrement}
				title={props.labels?.NEXT_DAY ?? "Next day"}
				type="button"
			>
				<IconChevronRight
				/>
			</Button>
		</form>
	);
}
