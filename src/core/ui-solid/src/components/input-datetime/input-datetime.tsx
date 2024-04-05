import { classnames } from "utils";
import { incrementDateByDay } from "utils/date";
import { splitProps } from "solid-js";

import { getDatetimeString } from "./input-datetime.helpers";
import { iconTimeline, iconChevronLeft, iconChevronRight } from "../../icons";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";
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
		const value = inputRef!.value;

		const nextValue = getDatetimeString(incrementDateByDay(value, step));
		props.onDatetimeChange?.(nextValue);
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
				type="button"
				title={props.dict.PREVIOUS_DAY}
			>
				<Icon
					viewBox="0 0 256 256"
					path={iconChevronLeft}
				/>
			</Button>
			<div class={styles["input-wrapper"]}>
				<label class={styles.label}>
					{props.children}
					<input
						aria-label={props.dict.DATETIME}
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
					title={props.dict.NOW}
					type="button"
				>
					<Icon path={iconTimeline} />
				</Button>
			</div>
			<Button
				class={styles["button-increment"]}
				data-step={1}
				onClick={handleIncrement}
				type="button"
				title={props.dict.NEXT_DAY}
			>
				<Icon
					viewBox="0 0 256 256"
					path={iconChevronRight}
				/>
			</Button>
		</form>
	);
}
