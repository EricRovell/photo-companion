import { schedule } from "./schedule";
import { countDays } from "@shared/utils";

export function isNavigationTime(date: Date = new Date()): boolean {
	const now = date.getTime();
	const start = new Date(date.getFullYear(), schedule.navigation[0] - 1, schedule.navigation[1], 0, 0, 0, 0);
	const end = new Date(date.getFullYear(), schedule.navigation[2] - 1, schedule.navigation[3], 23, 59, 59, 999);

	return now >= start.getTime() && now <= end.getTime();
}

export function getNavigationState(date: Date): { navigation: boolean, days: number } {
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
