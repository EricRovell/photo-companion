import { YEAR } from "../constants.js";
import { scheduleRawData } from "../../data/data.2023";
import type { ScheduleDataItem } from "../../types.js";

let date = new Date();
date.setFullYear(YEAR);
date.setMonth(0);
date.setDate(1);
date.setHours(0);
date.setMinutes(0);
date.setMilliseconds(0);
/* date = date.toLocaleDateString("ru-RU", {
	timeZone: "Europe/Moscow"
}); */

const TIMESTAMP_START = new Date(date);

const getTimestamp = (month: number, date: number, hours: number, minutes: number): number => {
	const d = new Date(TIMESTAMP_START.getTime());
	d.setMonth(month - 1);
	d.setDate(date);
	d.setHours(hours);
	d.setMinutes(minutes);

	return d.getTime();
};

/**
 * Transforms the illumination data into `timestamp` objects
 * when the illumination is turned on/off.
 */
const getScheduleData = (): ScheduleDataItem[] => {
	const result: ScheduleDataItem[] = [
		{
			lights: true,
			timestamp: TIMESTAMP_START.getTime(),
		}
	];

	for (const item of scheduleRawData) {
		const [ month, dateFrom, dateTo, hoursOff, minutesOff, hoursOn, minutesOn ] = item;
	
		for (let date = dateFrom; date <= dateTo; date++) {
			result.push(
				{
					lights: false,
					timestamp: getTimestamp(month, date, hoursOn, minutesOn)
				},
				{
					lights: true,
					timestamp: getTimestamp(month, date, hoursOff, minutesOff)
				},
			);
		}
	}

	result.push({
		lights: true,
		timestamp: getTimestamp(12, 31, 23, 59)
	});

	console.log(TIMESTAMP_START);

	return result;
};

export const scheduleData = getScheduleData();
