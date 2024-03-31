import type { JSX } from "solid-js";

export interface InputRadioOption {
	disabled?: boolean,
	label: string;
	value: string;
	selected?: boolean;
}

export interface InputRadioProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	options: InputRadioOption[];
}
