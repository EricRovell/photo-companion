import type { JSX } from "solid-js";

type SymbolType = Nullish<"CHECK" | "CROSS" | "MINUS">;

export interface CheckboxIconProps {
	symbolChecked?: SymbolType;
	symbolIndeterminate?: SymbolType;
	symbolUnchecked?: SymbolType;
}

export interface InputCheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement>, CheckboxIconProps {
	indeterminate?: Nullable<boolean>;
	label?: string;
	ref?: HTMLInputElement;
}
