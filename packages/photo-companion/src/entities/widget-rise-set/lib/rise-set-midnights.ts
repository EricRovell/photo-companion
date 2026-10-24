import { isNullable } from "utils/validators";

/**
 * Locate local calendar midnights by elapsed time, including clock-offset changes.
 */
export function getRiseSetMidnights(rise: Nullish<Date>, set: Nullish<Date>) {
	if (isNullable(rise) || isNullable(set)) {
		return [];
	}

	const start = rise.getTime();
	const end = set.getTime();

	if (![ start, end ].every(Number.isFinite) || end <= start) {
		return [];
	}

	const midnights: { date: Date;
progress: number }[] = [];

	const midnight = new Date(start);
	midnight.setHours(24, 0, 0, 0);

	while (midnight.getTime() < end) {
		midnights.push({
			date: new Date(midnight),
			progress: (midnight.getTime() - start) / (end - start)
		});
		midnight.setHours(24, 0, 0, 0);
	}

	return midnights;
}
