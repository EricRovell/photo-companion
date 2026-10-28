import { ALTITUDE_WIDGET_CONFIG } from "../config";

import type { AltitudeRange } from "../types";

const { altitudeTickCount, altitudeTickStep } = ALTITUDE_WIDGET_CONFIG.axis;

export function getAltitudeTicks(range: AltitudeRange) {
	const step = Math.max(altitudeTickStep, Math.ceil(
		(range.max - range.min) / (altitudeTickCount - 1) / altitudeTickStep
	) * altitudeTickStep);

	const first = Math.ceil(range.min / step) * step;
	const count = Math.floor((range.max - first) / step) + 1;

	return Array.from({ length: count }, (_, index) => first + index * step);
}
