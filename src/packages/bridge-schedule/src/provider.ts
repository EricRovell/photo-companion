import { dateFrom, incrementDateByDay } from "utils/date";
import { isNullable } from "utils/validators";

import { SUPPORTED_BRIDGES_NAME_SET } from "./const";
import { isNavigationTime } from "./navigation";
import { schedule } from "./schedule";

import type { BridgeName, BridgeScheduleEntry, BridgeState } from "./types";

/**
 * Returns a bridge state by a given date. The navigation period is taken into account.
 *
 * `ignoreNavigationSchedule` option let's the function ignore the navigation period
 * as if the bridges were operational throughout the year.
 * 
 * The current date is used as fallback.
 */
export function getBridgeState(name: BridgeName, date: Date, ignoreNavigationSchedule?: true): BridgeState;
export function getBridgeState(name: BridgeName, date = new Date(), ignoreNavigationSchedule = false): Nullish<BridgeState> {
	if (!ignoreNavigationSchedule && !isNavigationTime(date)) {
		return null;
	}

	const scheduleList = schedule.bridges[name];
	const now = date.getTime();

	// before first opening
	const firstOpeningTime = dateFrom(date, {
		hours: scheduleList[0][0],
		minutes: scheduleList[0][1],
		seconds: 0
	}).getTime();

	if (now < firstOpeningTime) {
		return {
			name,
			open: false,
			timestamp: firstOpeningTime
		};
	}

	// after last closing
	const lastClosingTime = dateFrom(date, {
		hours: scheduleList[scheduleList.length - 1][2],
		minutes: scheduleList[scheduleList.length - 1][3],
		seconds: 0
	}).getTime();

	if (now >= lastClosingTime) {
		return {
			name,
			open: false,
			timestamp: incrementDateByDay(new Date(firstOpeningTime), 1).getTime()
		};
	}

	// bridge is opened
	for (const [ hoursOpen, minutesOpen, hoursClose, minutesClose ] of scheduleList) {
		const timeOpenStart = dateFrom(date, {
			hours: hoursOpen,
			minutes: minutesOpen,
			seconds: 0
		}).getTime();

		const timeOpenEnd = dateFrom(date, {
			hours: hoursClose,
			minutes: minutesClose,
			seconds: 0
		}).getTime();

		if (now >= timeOpenStart && now < timeOpenEnd) {
			return {
				name,
				open: true,
				timestamp: timeOpenEnd
			};
		}
	}

	if (scheduleList.length > 1) {
		// in between openings
		for (let i = 0; i < scheduleList.length - 1; i++) {
			const hoursClose = scheduleList[i][2];
			const minutesClose = scheduleList[i][3];
			const hoursOpen = scheduleList[i + 1][0];
			const minutesOpen = scheduleList[i + 1][1];

			const timeClose = dateFrom(date, {
				hours: hoursClose,
				minutes: minutesClose,
				seconds: 0
			}).getTime();

			const timeOpen = dateFrom(date, {
				hours: hoursOpen,
				minutes: minutesOpen,
				seconds: 0
			}).getTime();

			if (now >= timeClose && now < timeOpen) {
				return {
					name,
					open: false,
					timestamp: timeOpen
				};
			}
		}
	}

	throw new Error(`The calculations are wrong, there is one opening for ${name} bridge and no result is found at ${date}.`);
}

/**
 * Returns the closest bridge event from the given date.
 * 
 * The current date is used as fallback.
 * 
 * TODO: refactor and move to "events" file
 */
export function getNextBridgeEvent(date = new Date()): BridgeState {
	let nextEventState: Nullable<BridgeState> = null;

	for (const name of SUPPORTED_BRIDGES_NAME_SET) {
		const state = getBridgeState(name, date, true);

		if (isNullable(nextEventState) || state.timestamp < nextEventState.timestamp) {
			nextEventState = state;
		}
	}

	if (isNullable(nextEventState)) {
		throw new Error(`Something is wrong, for the ${date} the next event is ${nextEventState}`);
	}

	return nextEventState;
}

/**
 * Returns a schedule entry data for a specific bridge.
 */
export function getBridgeScheduleEntry(name: BridgeName): BridgeScheduleEntry {
	return schedule.bridges[name];
}
