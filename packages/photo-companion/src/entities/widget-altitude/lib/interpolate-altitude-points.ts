import type { AltitudePoint } from "../types";

export function interpolateAltitudePoints(from: AltitudePoint[], to: AltitudePoint[], progress: number) {
	if (from.length === 0) {
		return to;
	}

	return to.map((point, index) => {
		// Match relative positions along the day, including 23- and 25-hour days.
		const position = to.length > 1 ? index * (from.length - 1) / (to.length - 1) : 0;
		const left = Math.floor(position);
		const right = Math.min(left + 1, from.length - 1);
		const altitude = from[left].altitude + (from[right].altitude - from[left].altitude) * (position - left);

		return {
			altitude: altitude + (point.altitude - altitude) * progress,
			timestamp: point.timestamp
		};
	});
}
