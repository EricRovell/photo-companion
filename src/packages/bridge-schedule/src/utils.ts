import { SUPPORTED_BRIDGES_NAME_SET } from "./const";
import type { NavigationSchedule } from "./types";

export function getTimestampFromTime(date: Date, hours: number, minutes: number): number {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		hours,
		minutes,
		0,
		0
	).getTime();
}

/**
 * Calculating the time when there are definetly no events after.
 */
export function getEdgeTime(schedule: NavigationSchedule) {
	let maxResult = 0;

	for (const name of SUPPORTED_BRIDGES_NAME_SET) {
		for (const [ hs, ms, he, me ] of schedule.bridges[name]) {
			maxResult = Math.max(
				maxResult,
				hs * 60 + ms,
				he * 60 + me
			);
		}
	}

	return maxResult;
}
