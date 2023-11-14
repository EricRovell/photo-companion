import data from "../../data/lights-spb.json" assert { type: "json" };
import { incrementDateByDay, isValidDate } from "@lib/helpers";
import type { Event, LightsEventName } from "@lib/types";

interface IlluminationSchedule {
	"lights:start": number;
	"lights:end": number;
}

interface IlluminationState {
	lights: boolean;
	event: LightsEventName;
	timestamp: number;
}

/**
 * Returns the illumination schedule for Saint-Petersburg, Russia for a given date.
 */
export function getLightsScheduleByDateSPb(dateInput = new Date()): IlluminationSchedule {
	if (!isValidDate(dateInput)) {
		return {
			"lights:start": NaN,
			"lights:end": NaN
		};
	}

	const year = new Date().getFullYear();
	const month = dateInput.getMonth() + 1;
	const date = dateInput.getDate();

	const row = (month * 6 - 6) + Math.min(Math.floor((date - 1) / 5), 5);
	const index = row * 4;

	return {
		"lights:start": new Date(year, month - 1, date, data[index], data[index + 1]).getTime(),
		"lights:end": new Date(year, month - 1, date, data[index + 2], data[index + 3]).getTime()
	};
}

/**
 * Returns the state for current moment and a time till the next event.
 * 
 * There are 3 cases, when the time right now is:
 * 
 * - Before the lights end;
 * - Before lights start;
 * - During the lights before they end the next day;
 */
export function getLightsStateByDateSpb(dateInput = new Date()): IlluminationState {
	const schedule = getLightsScheduleByDateSPb(dateInput);
	const timestamp = dateInput.getTime();

	if (timestamp < schedule["lights:end"]) {
		return {
			lights: true,
			event: "lights:end",
			timestamp: schedule["lights:end"]
		};
	}

	if (timestamp >= schedule["lights:end"] && timestamp <= schedule["lights:start"]) {
		return {
			lights: false,
			event: "lights:start",
			timestamp: schedule["lights:start"]
		};
	}

	const nextDay = incrementDateByDay(dateInput, 1);
	const scheduleNext = getLightsScheduleByDateSPb(nextDay);

	return {
		lights: true,
		event: "lights:end",
		timestamp: scheduleNext["lights:end"]
	};
}

export function getLightsEvents(date: Date = new Date()): Event<LightsEventName>[] {
	const data = getLightsScheduleByDateSPb(date);

	return [
		{
			name: "lights:start",
			timestamp: data["lights:start"],
			data: {}
		},
		{
			name: "lights:end",
			timestamp: data["lights:end"],
			data: {}
		}
	];
}
