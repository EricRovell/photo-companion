import type { JSX } from "solid-js";

export interface InputRadioOption {
	disabled?: boolean,
	label: string;
	selected?: boolean;
	value: string;
}

export interface InputRadioProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	options: InputRadioOption[];
}
