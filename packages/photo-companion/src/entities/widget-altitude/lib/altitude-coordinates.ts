import { ALTITUDE_WIDGET_CONFIG } from "../config";

import type { AltitudeRange } from "../types";

const { plot } = ALTITUDE_WIDGET_CONFIG;

export const altitudeX = (timestamp: number, start: number, end: number) => (
	plot.left + (timestamp - start) / (end - start) * plot.width
);

export const altitudeY = (altitude: number, range: AltitudeRange) => (
	plot.top + (range.max - altitude) / (range.max - range.min) * plot.height
);
