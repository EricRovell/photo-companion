import { isNullable } from "utils/validators";

import type { Accessor, JSX } from "solid-js";

import { createQueryDate } from "~/shared/lib/query-date";

import { parseDatetimeValue } from "../lib/parse-datetime-value";

import type { InputDatetimeProps } from "../types";

interface CreateNativeDatetimePickerOptions {
	cancelInteraction: () => void;
	disabled: Accessor<boolean>;
	onDatetimeChange: Accessor<InputDatetimeProps["onDatetimeChange"]>;
	setDate: (date: Date) => void;
	setPendingValue: (value: string) => void;
}

export function createNativeDatetimePicker(options: CreateNativeDatetimePickerOptions) {
	let inputRef: Undefinable<HTMLInputElement>;

	const handleChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
		const value = event.currentTarget.value;
		const date = parseDatetimeValue(value);

		if (!isNullable(date)) {
			options.cancelInteraction();
			options.setDate(date);
			options.setPendingValue(createQueryDate(date));
		}

		options.onDatetimeChange()?.(value);
	};

	const open = () => {
		if (options.disabled() || isNullable(inputRef)) {
			return;
		}

		try {
			inputRef.showPicker();
		} catch {
			inputRef.focus({ preventScroll: true });
			inputRef.click();
		}
	};

	return {
		handleChange,
		open,
		setInputRef: (element: HTMLInputElement) => {
			inputRef = element;
		}
	};
}
