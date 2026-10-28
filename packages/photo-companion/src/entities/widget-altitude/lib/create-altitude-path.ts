import { altitudeX, altitudeY } from "./altitude-coordinates";

import type { AltitudePoint, AltitudeRange } from "../types";

export function createAltitudePath(points: AltitudePoint[], start: number, end: number, range: AltitudeRange) {
	return points.flatMap((point, index) => [
		index === 0 ? "M" : "L",
		altitudeX(point.timestamp, start, end).toFixed(2),
		altitudeY(point.altitude, range).toFixed(2)
	]).join(" ");
}
