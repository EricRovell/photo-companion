import type { JSX } from "solid-js";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	appearance?: "ghost" | "fill" | "outline";
	variant?: Nullable<"success" | "danger">;
}
