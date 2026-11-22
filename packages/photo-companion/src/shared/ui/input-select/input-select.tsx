export interface InputSelectOption<T extends string = string> {
	disabled?: boolean,
	label: string;
	selected?: boolean;
	value: T;
}
