import type { JSX } from "solid-js";

export interface FieldsetProps extends JSX.HTMLAttributes<HTMLFieldSetElement> {
	legend?: string;
}

export type FormProps = JSX.HTMLAttributes<HTMLFormElement>;
