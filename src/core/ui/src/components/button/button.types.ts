import type { JSX } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	appearance?: "fill" | "ghost" | "outline";
	icon?: boolean;
	loading?: boolean;
	variant?: Nullable<"danger" | "success">;
}
