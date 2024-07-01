import type { JSX } from "solid-js";

export interface MoonProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
	phase?: number;
	precision?: number;
	rotation?: number;
	size?: number;
}

export interface CircleCommonProps extends JSX.SvgSVGAttributes<SVGCircleElement> {
	cx: number;
	cy: number;
	r: number;
}

export type CircleProps = JSX.SvgSVGAttributes<SVGCircleElement>;
