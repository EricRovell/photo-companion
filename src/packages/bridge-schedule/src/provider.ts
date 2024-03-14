import { dateFrom, incrementDateByDay } from "utils/date";

import { schedule } from "./schedule";
import { isNavigationTime } from "./navigation";
import { SUPPORTED_BRIDGES_NAME_SET } from "./const";
import type { BridgeState, BridgeName, BridgeSheduleEntry } from "./types";

export function getBridgeState(name: BridgeName, date: Date, ignoreNavigationSchedule?: true): BridgeState;
export function getBridgeState(name: BridgeName, date: Date, ignoreNavigationSchedule = false): BridgeState | null {
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

// TODO: refactor and move to "events" file
export function getNextBridgeEvent(date = new Date()): BridgeState {
	let nextEventState: BridgeState;

	for (const name of SUPPORTED_BRIDGES_NAME_SET) {
		const state = getBridgeState(name, date, true);

		if (!nextEventState! || state.timestamp < nextEventState.timestamp) {
			nextEventState = state!;
		}
	}

	return nextEventState!;
}

export function getBridgeScheduleEntry(name: BridgeName): BridgeSheduleEntry {
	return schedule["bridges"][name];
}
