import type { JSX, ParentProps  } from "solid-js";

export interface IconProps extends ParentProps<JSX.SvgSVGAttributes<SVGSVGElement>> {
	title?: string;
	viewBox?: string;
}
