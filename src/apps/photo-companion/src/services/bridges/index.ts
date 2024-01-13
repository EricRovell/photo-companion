import { scheduleBridgesSPb as schedule, type BridgeName, type BridgeShedule } from "@shared/schedule";
import { incrementDateByDay } from "@lib/helpers";
import { countDays } from "@lib/helpers";
import type { BridgeState } from "@shared/types";

export const BRIDGE_NAME_SET = new Set<BridgeName>([
	"alexander-nevsky",
	"annunciation",
	"exchange",
	"bolsheokhtinsky",
	"volodarsky",
	"palace",
	"liteyny",
	"trinity",
	"tuchkov",
	"sampsonievsky",
	"grenadersky",
	"kantemirovsky"
]);

export function isBridgeException(name: BridgeName): boolean {
	return schedule.exception.includes(name);
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

export function isNavigationTime(date: Date): boolean {
	const now = date.getTime();
	const start = new Date(date.getFullYear(), schedule.navigation[0] - 1, schedule.navigation[1], 0, 0, 0, 0);
	const end = new Date(date.getFullYear(), schedule.navigation[2] - 1, schedule.navigation[3], 23, 59, 59, 999);

	return now >= start.getTime() && now <= end.getTime();
}

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

export function getBridgeStateByDate(name: BridgeName, date: Date, ignoreNavigationSchedule = false): BridgeState | null {
	if (!ignoreNavigationSchedule && !isNavigationTime(date)) {
		return null;
	}

	const scheduleList = schedule.bridges[name];
	const now = date.getTime();

	// before first opening
	const firstOpeningTime = getTimestampFromTime(date, scheduleList[0][0], scheduleList[0][1]);

	if (now < firstOpeningTime) {
		return {
			name,
			open: false,
			timestamp: firstOpeningTime
		};
	}

	// after last closing
	const lastClosingTime = getTimestampFromTime(
		date,
		scheduleList[scheduleList.length - 1][2],
		scheduleList[scheduleList.length - 1][3]
	);

	if (now >= lastClosingTime) {
		return {
			name,
			open: false,
			timestamp: incrementDateByDay(new Date(firstOpeningTime), 1).getTime()
		};
	}

	// bridge is opened
	for (const [ hoursOpen, minutesOpen, hoursClose, minutesClose ] of scheduleList) {
		const timeOpenStart = getTimestampFromTime(date, hoursOpen, minutesOpen);

		const timeOpenEnd = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			hoursClose,
			minutesClose,
			0,
			0
		).getTime();

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

			const timeClose = getTimestampFromTime(date, hoursClose, minutesClose);
			const timeOpen = getTimestampFromTime(date, hoursOpen, minutesOpen);

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

export function getNextBridgeEvent(date = new Date()): BridgeState {
	let nextEventState: BridgeState;

	for (const name of BRIDGE_NAME_SET) {
		const state = getBridgeStateByDate(name, date, true);

		if (!nextEventState! || state!.timestamp < nextEventState.timestamp) {
			nextEventState = state!;
		}
	}

	return nextEventState!;
}

export function getBridgeSchedule(name: BridgeName): BridgeShedule {
	return schedule["bridges"][name];
}
