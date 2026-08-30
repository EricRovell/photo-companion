import { calcDuration, shiftDate } from "utils/date";
import { isNullable, isValidDate } from "utils/validators";

import type { City, IlluminationState, LightsCity, LightsEvent, LightsSchedule } from "types";

import { SUPPORTED_CITY_SET } from "./const";
import { data } from "./schedule";
import {
	initSolarLightsProvider,
	initUnavailableSolarLightsProvider,
	isSolarLightsLocation
} from "./solar-provider";

import type { LightsProvider, SolarLightsLocation } from "./types";

export function isSupportedCity(city: Nullable<string>): city is LightsCity {
	if (isNullable(city)) {
		return false;
	}

	return SUPPORTED_CITY_SET.has(city);
}

export function initLightsProvider(
	cityName: Nullable<City>,
	location?: SolarLightsLocation
): LightsProvider {
	if (!isSupportedCity(cityName)) {
		if (isSolarLightsLocation(location)) {
			return initSolarLightsProvider(location);
		}

		return initUnavailableSolarLightsProvider();
	}

	const { city, getter, schedule, year } = data[cityName];

	/**
	 * Returns the lights schedule for a given date.
	 */
	function getScheduleByDate(input = new Date()): LightsSchedule {
		if (!isValidDate(input)) {
			return {
				duration: null,
				"LIGHTS_END": null,
				"LIGHTS_START": null,
				source: "SCHEDULE",
				status: "UNAVAILABLE",
				uncertaintyMinutes: 0
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
			LIGHTS_START: start.getTime(),
			source: "SCHEDULE",
			status: "SCHEDULED",
			uncertaintyMinutes: 0
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

		if (schedule.status !== "SCHEDULED") {
			return { event: null, lights: false, timestamp: null };
		}

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

		const nextDay = shiftDate(input, "day", 1);
		const scheduleNext = getScheduleByDate(nextDay);

		if (scheduleNext.status !== "SCHEDULED") {
			return { event: null, lights: true, timestamp: null };
		}

		return {
			event: "LIGHTS_END",
			lights: true,
			timestamp: scheduleNext.LIGHTS_END
		};
	}

	function getEventsByDate(input: Date = new Date()): LightsEvent[] {
		const schedule = getScheduleByDate(input);

		if (schedule.status !== "SCHEDULED") {
			return [];
		}

		return [
			{
				data: {
					city,
					source: "SCHEDULE"
				},
				name: "LIGHTS_START",
				timestamp: schedule.LIGHTS_START,
				type: "LIGHTS"
			},
			{
				data: {
					city,
					source: "SCHEDULE"
				},
				name: "LIGHTS_END",
				timestamp: schedule.LIGHTS_END,
				type: "LIGHTS"
			}
		];
	}

	return {
		city,
		getEventsByDate,
		getScheduleByDate,
		getStateByDate,
		source: "SCHEDULE",
		year
	};
}
