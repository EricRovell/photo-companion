import type { JSX } from "solid-js";

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	block?: boolean;
	targetBlank?: boolean;
	nofollow?: boolean;
}
