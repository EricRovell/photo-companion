import type { JSX } from "solid-js";

export interface DetailsProps extends JSX.DetailsHtmlAttributes<HTMLDetailsElement> {
	label: string;
}
