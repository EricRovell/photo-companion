import { ALTITUDE_WIDGET_CONFIG } from "../config";

import type { AltitudePoint } from "../types";

const { peakRefinementSteps, sampleInterval } = ALTITUDE_WIDGET_CONFIG.path;

/** Sample the entire local day, including the following midnight to finish the curve. */
export function sampleAltitude(start: number, end: number, getAltitude: (timestamp: number) => number) {
	const count = Math.ceil((end - start) / sampleInterval);

	const points: AltitudePoint[] = Array.from({ length: count + 1 }, (_, index) => {
		const timestamp = start + (end - start) * index / count;
		return {
			altitude: getAltitude(timestamp),
			timestamp
		};
	});

	// The following midnight belongs to the curve, but not to this day's maximum.
	const last = {
		altitude: getAltitude(end - 1),
		timestamp: end - 1
	};

	const highest = [ ...points.slice(0, -1), last ].reduce((peak, point) => point.altitude > peak.altitude ? point : peak);
	let left = Math.max(start, highest.timestamp - sampleInterval);
	let right = Math.min(end - 1, highest.timestamp + sampleInterval);

	// Refine the sampled maximum so its displayed time isn't rounded to a five-minute step.
	for (let index = 0; index < peakRefinementSteps; index++) {
		const first = left + (right - left) / 3;
		const second = right - (right - left) / 3;

		if (getAltitude(first) < getAltitude(second)) {
			left = first;
		} else {
			right = second;
		}
	}

	const timestamp = Math.round((left + right) / 2);

	const refined = {
		altitude: getAltitude(timestamp),
		timestamp
	};

	const peak = refined.altitude > highest.altitude ? refined : highest;

	return {
		peak,
		points
	};
}
