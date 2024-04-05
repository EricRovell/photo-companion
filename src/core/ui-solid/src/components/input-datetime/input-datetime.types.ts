import type { JSX } from "solid-js";

interface Dict {
	DATETIME: string;
	NEXT_DAY: string;
	PREVIOUS_DAY: string;
	NOW: string;
}

export interface InputDatetimeProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	dict: Dict;
	onDatetimeChange?: (value: string) => void;
}
