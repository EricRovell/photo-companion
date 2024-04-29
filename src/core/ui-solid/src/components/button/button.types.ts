import type { JSX } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	appearance?: "ghost" | "fill" | "outline";
	loading?: boolean;
	variant?: Nullable<"success" | "danger">;
}
