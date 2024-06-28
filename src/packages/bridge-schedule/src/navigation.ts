import { countDays } from "utils/date";

import { schedule } from "./schedule";

/**
 * Drawbridges are functional within a so called navigation period when the rivers are not frozen.
 * `isNavigationTime` provides a convenient way to check
 * is the drawbridges are operational or not for a given date.
 *
 * The current date is used as fallback.
 */
export function isNavigationTime(date: DateLike = Date.now()): boolean {
	if (date instanceof Date) {
		date = date.getTime();
	}

	const dateInput = new Date(date);

	const now = dateInput.getTime();
	const start = new Date(dateInput.getFullYear(), schedule.navigation[0] - 1, schedule.navigation[1], 0, 0, 0, 0);
	const end = new Date(dateInput.getFullYear(), schedule.navigation[2] - 1, schedule.navigation[3], 23, 59, 59, 999);

	return now >= start.getTime() && now <= end.getTime();
}

/**
 * Returns a navigation state for a given date:
 * is navigation is open and how many days there are till the navigation opens or closed.
 *
 * The current date is used as fallback.
 */
export function getNavigationState(date: Date = new Date()): { days: number, navigation: boolean } {
	const now = date.getTime();
	const start = new Date(date.getFullYear(), schedule.navigation[0] - 1, schedule.navigation[1], 0, 0, 0, 0).getTime();
	const end = new Date(date.getFullYear(), schedule.navigation[2] - 1, schedule.navigation[3], 23, 59, 59, 999).getTime();

	if (now < start) {
		return {
			days: countDays(now, start),
			navigation: false
		};
	}

	if (now >= start && now <= end) {
		return {
			days: countDays(now, end),
			navigation: true
		};
	}

	const nextYearStartDate = new Date(start);
	nextYearStartDate.setFullYear(date.getFullYear() + 1);

	return {
		days: countDays(now, nextYearStartDate),
		navigation: false
	};
}
