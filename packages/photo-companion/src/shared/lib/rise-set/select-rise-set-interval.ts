import { getDayStart, shiftDate } from "utils/date";
import { isNullable } from "utils/validators";

import type { RiseSetInterval } from "moon-sun-calc";

/**
 * Prefer the active interval, then the cycle rising on the selected local day.
 * Intervals must be chronological, as returned by the calculator.
 */
export function selectRiseSetInterval(date: Date, intervals: readonly RiseSetInterval[]): RiseSetInterval {
	const timestamp = date.getTime();
	const dayStart = getDayStart(date);
	const dayEnd = shiftDate(dayStart, "day", 1).getTime();
	let previous: RiseSetInterval | undefined;

	for (let index = intervals.length - 1; index >= 0; index--) {
		const interval = intervals[index];

		if (interval.rise && interval.rise.getTime() <= timestamp) {
			previous = interval;
			break;
		}
	}

	if (previous && (isNullable(previous.set) || timestamp <= previous.set.getTime())) {
		return previous;
	}

	const following = intervals.find(({ set }) => {
		return set && set.getTime() >= timestamp;
	});

	if (!previous && following && !following.rise) {
		return following;
	}

	const upcoming = intervals.find(({ rise }) => {
		return rise && rise.getTime() >= timestamp && rise.getTime() < dayEnd;
	});

	if (upcoming) {
		return upcoming;
	}

	if (previous?.rise && previous.rise.getTime() >= dayStart) {
		return previous;
	}

	return intervals.find(({ set }) => {
		return set && set.getTime() >= dayStart && set.getTime() < dayEnd;
	}) ?? {
		rise: null,
		set: null
	};
}
