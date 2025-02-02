import { splitProps } from "solid-js";
import { classnames } from "utils";
import { incrementDateByDay } from "utils/date";
import { isNullable } from "utils/validators";

import { Button } from "../button/button";
import { IconChevronLeft, IconChevronRight, IconTimeline } from "../icon";
import { getDatetimeString } from "./input-datetime.helpers";

import type { InputDatetimeProps } from "./input-datetime.types";

import styles from "./input-datetime.module.css";

export function InputDatetime(allProps: InputDatetimeProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"dict",
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
				title={props.dict?.PREVIOUS_DAY ?? "Previous day"}
				type="button"
			>
				<IconChevronLeft />
			</Button>
			<div class={styles["input-wrapper"]}>
				<label class={styles.label}>
					{props.children}
					<input
						aria-label={props.dict?.DATETIME ?? "Date and time"}
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
					title={props.dict?.NOW ?? "Now"}
					type="button"
				>
					<IconTimeline />
				</Button>
			</div>
			<Button
				class={styles["button-increment"]}
				data-step={1}
				onClick={handleIncrement}
				title={props.dict?.NEXT_DAY ?? "Next day"}
				type="button"
			>
				<IconChevronRight
				/>
			</Button>
		</form>
	);
}
