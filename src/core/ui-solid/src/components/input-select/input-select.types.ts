import type { JSX } from "solid-js";

export interface InputSelectOption {
	disabled?: boolean,
	label: string;
	value: string;
	selected?: boolean;
}

export interface InputSelectProps extends JSX.InputHTMLAttributes<HTMLSelectElement> {
	label?: string;
	options: InputSelectOption[];
}
