import type { JSX } from "solid-js";

interface Dict {
	DATETIME: string;
	NEXT_DAY: string;
	NOW: string;
	PREVIOUS_DAY: string;
}

export interface InputDatetimeProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	dict?: Dict;
	onDatetimeChange?: (value: string) => void;
}
