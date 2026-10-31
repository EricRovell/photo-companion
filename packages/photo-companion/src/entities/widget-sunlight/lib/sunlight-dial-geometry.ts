import { polarToCartesian } from "utils/math";

import { SUNLIGHT_WIDGET_CONFIG } from "../config";

export function getSunlightDialPoint(progress: number, radius: number) {
	return polarToCartesian(
		SUNLIGHT_WIDGET_CONFIG.dial.center,
		SUNLIGHT_WIDGET_CONFIG.dial.center,
		radius,
		180 + progress * 360
	);
}

export function buildSunlightArc(start: number, end: number, radius: number) {
	const point = getSunlightDialPoint(start, radius);
	const middle = getSunlightDialPoint((start + end) / 2, radius);
	const last = getSunlightDialPoint(end, radius);

	// Two arcs also draw a complete circle for continuous polar phases.
	return [
		`M ${point.x} ${point.y}`,
		`A ${radius} ${radius} 0 0 1 ${middle.x} ${middle.y}`,
		`A ${radius} ${radius} 0 0 1 ${last.x} ${last.y}`
	].join(" ");
}
