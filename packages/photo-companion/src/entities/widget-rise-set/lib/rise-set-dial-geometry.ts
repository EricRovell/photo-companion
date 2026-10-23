import { polarToCartesian, round } from "utils/math";

import { RISE_SET_WIDGET_CONFIG } from "../config";

const DIAL = RISE_SET_WIDGET_CONFIG.dial;

export function getRiseSetDialPoint(angle: number, radius: number) {
	return polarToCartesian(DIAL.center, DIAL.center, radius, angle);
}

export function buildRiseSetArcPath(radius: number, angleSpan: number = DIAL.angleSpan) {
	const start = getRiseSetDialPoint(DIAL.angleStart, radius);
	const end = getRiseSetDialPoint(DIAL.angleStart + angleSpan, radius);
	const largeArc = angleSpan > 180 ? 1 : 0;

	return [
		`M ${round(start.x, 6)} ${round(start.y, 6)}`,
		`A ${radius} ${radius} 0 ${largeArc} 1`,
		`${round(end.x, 6)} ${round(end.y, 6)}`
	].join(" ");
}

export function createRiseSetDialTicks() {
	return Array.from({ length: Math.floor(DIAL.angleSpan / DIAL.tick.angleStep) + 1 }, (_, index) => {
		const angle = DIAL.angleStart + index * DIAL.tick.angleStep;
		const major = index % DIAL.tick.majorEvery === 0;

		return {
			end: getRiseSetDialPoint(angle, DIAL.tick.outerRadius),
			major,
			start: getRiseSetDialPoint(angle, major ? DIAL.tick.majorInnerRadius : DIAL.tick.innerRadius)
		};
	});
}

export function getRiseSetDialViewBox() {
	return `${DIAL.center - DIAL.tick.outerRadius} 0 ${DIAL.tick.outerRadius * 2} ${DIAL.viewBoxHeight}`;
}
