import type { JSX } from "solid-js";

import type { Classes } from "../../types";

type SymbolType = Nullish<"CHECK" | "CROSS" | "MINUS">;

export interface CheckboxIconProps {
	class?: string;
	symbolChecked?: SymbolType;
	symbolIndeterminate?: SymbolType;
	symbolUnchecked?: SymbolType;
}

export interface InputCheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "class">, CheckboxIconProps {
	classes?: Classes<"icon" | "input" | "label" | "title">;
	indeterminate?: Nullable<boolean>;
	label?: string;
	ref?: HTMLInputElement;
}
