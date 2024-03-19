import { schedule } from "./schedule";
import { countDays } from "utils/date";

/**
 * Drawbridges are functional within a so called navigation period when the rivers are not frozen.
 * `isNavigationTime` provides a convenient way to check
 * is the drawbridges are operational or not for a given date.
 *
 * The current date is used as fallback.
 */
export function isNavigationTime(date: Date = new Date()): boolean {
	const now = date.getTime();
	const start = new Date(date.getFullYear(), schedule.navigation[0] - 1, schedule.navigation[1], 0, 0, 0, 0);
	const end = new Date(date.getFullYear(), schedule.navigation[2] - 1, schedule.navigation[3], 23, 59, 59, 999);

	return now >= start.getTime() && now <= end.getTime();
}

/**
 * Returns a navigation state for a given date:
 * is navigation is open and how many days there are till the navigation opens or closed.
 *
 * The current date is used as fallback.
 */
export function getNavigationState(date: Date = new Date()): { navigation: boolean, days: number } {
	const now = date.getTime();
	const start = new Date(date.getFullYear(), schedule.navigation[0] - 1, schedule.navigation[1], 0, 0, 0, 0).getTime();
	const end = new Date(date.getFullYear(), schedule.navigation[2] - 1, schedule.navigation[3], 23, 59, 59, 999).getTime();

	if (now < start) {
		return {
			navigation: false,
			days: countDays(now, start)
		};
	}

	if (now >= start && now <= end) {
		return {
			navigation: true,
			days: countDays(now, start)
		};
	}

	const nextYearStartDate = new Date(start);
	nextYearStartDate.setFullYear(date.getFullYear() + 1);

	return {
		navigation: false,
		days: countDays(now, nextYearStartDate)
	};
}
