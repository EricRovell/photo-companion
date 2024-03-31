import type { JSX  } from "solid-js";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
	path: string;
	viewBox?: string;
	title?: string;
}
