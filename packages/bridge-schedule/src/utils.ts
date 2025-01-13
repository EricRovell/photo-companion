import { isNavigationTime } from "./navigation";
import { FIRST_OPENING_MINUTES, LAST_CLOSING_MINUTES, schedule } from "./schedule";

import type { BridgeName } from "./types";

/**
 * Some drawbridges has non-permanent schedule.
 * The `isBridgeException` provides a way to check
 * is the given bridge should be considered as such an exception.
 */
export function isBridgeException(name: BridgeName): boolean {
	return schedule.exception.includes(name);
}

/**
 * Returns a boolean indicating whether all the drawbridges are lifted down
 * for a specific time.
 */
export function isAllBridgesLiftedDown(date: DateLike = Date.now(), ignoreNavigation = false): boolean {
	if (!isNavigationTime(date) && !ignoreNavigation) {
		return true;
	}

	if (typeof date === "number") {
		date = new Date(date);
	}

	const minutes = date.getHours() * 60 + date.getMinutes();

	return minutes < FIRST_OPENING_MINUTES || minutes >= LAST_CLOSING_MINUTES;
}
