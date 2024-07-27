import type { JSX } from "solid-js";

export interface InputSelectOption {
	disabled?: boolean,
	label: string;
	selected?: boolean;
	value: string;
}

export interface InputSelectProps extends JSX.InputHTMLAttributes<HTMLSelectElement> {
	label?: string;
	options: InputSelectOption[];
}
