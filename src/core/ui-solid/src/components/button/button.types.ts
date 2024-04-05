import type { JSX } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	appearance?: "ghost" | "fill" | "outline";
	variant?: Nullable<"success" | "danger">;
}
