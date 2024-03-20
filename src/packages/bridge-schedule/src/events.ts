import type { BridgeEvent } from "types";
import { dateFrom } from "utils/date";

import { schedule } from "./schedule";
import { SUPPORTED_BRIDGES_NAME_SET } from ".";
import { isNavigationTime } from "./navigation";

/**
 * Returns all bridge events occurred at the given date.
 * Note: Bridge events only available during navigation phase
 *
 * The current date used as fallback.
 */
export function getBridgeEvents(date = new Date()): BridgeEvent[] {
	const events: BridgeEvent[] = [];

	// 
	if (!isNavigationTime(date)) {
		return events;
	}

	for (const name of SUPPORTED_BRIDGES_NAME_SET) {
		for (const [ hs, ms, he, me ] of schedule.bridges[name]) {
			events.push({
				data: {
					bridgeName: name,
					open: true
				},
				name: `${name}_OPEN`,
				timestamp: dateFrom(date, { hours: hs, minutes: ms }).getTime(),
				type: "BRIDGE"
			});

			events.push({
				data: {
					bridgeName: name,
					open: false
				},
				name: `${name}_CLOSE`,
				timestamp: dateFrom(date, { hours: he, minutes: me }).getTime(),
				type: "BRIDGE"
			});
		}
	}

	return events;
}
