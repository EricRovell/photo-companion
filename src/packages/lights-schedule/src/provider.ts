import { calcDuration, incrementDateByDay } from "utils/date";
import { isNullable, isValidDate } from "utils/validators";

import type { IlluminationState, LightsCity, LightsEvent, LightsSchedule } from "types";

import { SUPPORTED_CITY_SET } from "./const";
import { data } from "./schedule";

import type { LightsProvider } from "./types";

export function isSupportedCity(city: Nullable<string>): city is LightsCity {
	if (isNullable(city)) {
		return false;
	}

	return SUPPORTED_CITY_SET.has(city);
}

export function initLightsProvider(cityName: Nullable<LightsCity>): LightsProvider {
	if (!isSupportedCity(cityName)) {
		throw new Error(`Unsupported city provided: ${cityName}`);
	}

	const { city, getter, schedule, year } = data[cityName];

	/**
	 * Returns the lights schedule for a given date.
	 */
	function getScheduleByDate(input = new Date()): LightsSchedule {
		if (!isValidDate(input)) {
			return {
				duration: 0,
				"LIGHTS_END": NaN,
				"LIGHTS_START": NaN
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
			LIGHTS_END: end.getTime(),
			LIGHTS_START: start.getTime()
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

		if (timestamp < schedule.LIGHTS_END) {
			return {
				event: "LIGHTS_END",
				lights: true,
				timestamp: schedule.LIGHTS_END
			};
		}

		if (timestamp >= schedule.LIGHTS_END && timestamp <= schedule.LIGHTS_START) {
			return {
				event: "LIGHTS_START",
				lights: false,
				timestamp: schedule.LIGHTS_START
			};
		}

		const nextDay = incrementDateByDay(input, 1);
		const scheduleNext = getScheduleByDate(nextDay);

		return {
			event: "LIGHTS_END",
			lights: true,
			timestamp: scheduleNext.LIGHTS_END
		};
	}

	function getEventsByDate(input: Date = new Date()): LightsEvent[] {
		const data = getScheduleByDate(input);

		return [
			{
				data: {
					city
				},
				name: "LIGHTS_START",
				timestamp: data.LIGHTS_START,
				type: "LIGHTS"
			},
			{
				data: {
					city
				},
				name: "LIGHTS_END",
				timestamp: data.LIGHTS_END,
				type: "LIGHTS"
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
