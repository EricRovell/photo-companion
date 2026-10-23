import { DAY_MS, toTimestamp } from "../shared";

import type { UtcInterval } from "../types";
import type { RiseSetCrossing, RiseSetInterval } from "./types";

/** Search and pair crossings without assigning a civil day or a display cycle. */
export function searchRiseSetIntervals(
	interval: UtcInterval,
	getCrossings: (interval: UtcInterval) => RiseSetCrossing[]
): RiseSetInterval[] {
	const start = toTimestamp(interval.start, "interval.start");
	const end = toTimestamp(interval.end, "interval.end");

	if (end <= start) {
		throw new RangeError("interval.end must be later than interval.start");
	}

	const crossings: RiseSetCrossing[] = [];

	for (let cursor = start; cursor < end; cursor += DAY_MS) {
		crossings.push(...getCrossings({ end: Math.min(cursor + DAY_MS, end), start: cursor }));
	}

	crossings.sort((left, right) => left.time.getTime() - right.time.getTime());

	const intervals: RiseSetInterval[] = [];

	let rise: Date | null = null;
	let previous: RiseSetCrossing | undefined;

	for (const crossing of crossings) {
		// Root refinement on either side of a chunk boundary can find the same event.
		if (previous?.direction === crossing.direction && crossing.time.getTime() - previous.time.getTime() < 1000) {
			continue;
		}

		previous = crossing;

		if (crossing.direction === "rising") {
			if (rise) {
				intervals.push({ rise, set: null });
			}

			rise = crossing.time;
		} else {
			intervals.push({ rise, set: crossing.time });
			rise = null;
		}
	}

	if (rise) {
		intervals.push({ rise, set: null });
	}

	return intervals;
}
