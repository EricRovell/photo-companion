import { isNullable } from "utils/validators";

export function calculateRiseSetProgress(date: Date, rise: Nullish<Date>, set: Nullish<Date>) {
	if (isNullable(rise) || isNullable(set)) {
		return { arc: 0, position: null };
	}

	const start = rise.getTime();
	const end = set.getTime();
	const current = date.getTime();

	if (![ start, end, current ].every(Number.isFinite) || end <= start) {
		return { arc: 0, position: null };
	}

	// Event links store whole seconds, while calculator events include milliseconds.
	if (current % 1000 === 0) {
		if (Math.floor(current / 1000) === Math.floor(start / 1000)) {
			return { arc: 0, position: 0 };
		}

		if (Math.floor(current / 1000) === Math.floor(end / 1000)) {
			return { arc: 1, position: 1 };
		}
	}

	if (current < start || current > end) {
		return { arc: current > end ? 1 : 0, position: null };
	}

	const progress = (current - start) / (end - start);
	return { arc: progress, position: progress };
}
