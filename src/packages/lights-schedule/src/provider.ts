import { calcDuration, incrementDateByDay, isValidDate } from "@shared/utils";
import { data } from "./schedule";
import { SUPPORTED_CITY_SET } from "./const";
import type { IlluminationState, LightsSchedule, LightsCity, LightsEvent } from "@shared/types";
import type { LightsProvider } from "./types";

export function isSupportedCity(city: Nullable<string>): city is LightsCity {
	if (!city) {
		return false;
	}

	return SUPPORTED_CITY_SET.has(city);
}

export function initLightsProvider(cityName: Nullable<LightsCity>): LightsProvider | null {
	if (!isSupportedCity(cityName)) {
		return null;
	}

	const { year, city, schedule, getter } = data[cityName];

	/**
	 * Returns the lights schedule for a given date.
	 */
	function getScheduleByDate(input = new Date()): LightsSchedule {
		if (!isValidDate(input)) {
			return {
				duration: 0,
				"lights:start": NaN,
				"lights:end": NaN
			};
		}
	
		const year = input.getFullYear();
		const month = input.getMonth();
		const date = input.getDate();
		const dataIndex = getter(input);

		const start = new Date(year, month, date, schedule[dataIndex], schedule[dataIndex + 1]);
		const end = new Date(year, month, date, schedule[dataIndex + 2], schedule[dataIndex + 3]);

		return {
			duration: calcDuration(start, end),
			"lights:start": start.getTime(),
			"lights:end": end.getTime()
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
	function getStateByDate(input: Date = new Date()): IlluminationState {
		const schedule = getScheduleByDate(input);
		const timestamp = input.getTime();

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

		const nextDay = incrementDateByDay(input, 1);
		const scheduleNext = getScheduleByDate(nextDay);

		return {
			lights: true,
			event: "lights:end",
			timestamp: scheduleNext["lights:end"]
		};
	}

	function getEventsByDate(input: Date = new Date()): LightsEvent[] {
		const data = getScheduleByDate(input);

		return [
			{
				name: "lights:start",
				timestamp: data["lights:start"],
				data: {
					city
				}
			},
			{
				name: "lights:end",
				timestamp: data["lights:end"],
				data: {
					city
				}
			}
		];
	}

	return {
		city,
		getEventsByDate,
		getScheduleByDate,
		getStateByDate,
		year
	};
}
