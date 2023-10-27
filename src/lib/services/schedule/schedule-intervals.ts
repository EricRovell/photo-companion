import { schedule } from "../../../data/data";
import { currentYear } from "../../constants";
import type { ScheduleDataItem } from "../../../types.js";

export const getTimestamp = (
	year: number,
	month: number,
	date: number,
	hours: number = 0,
	minutes: number = 0,
	seconds: number = 0,
	miliseconds: number = 0
): number => {
	const d = new Date();
	d.setFullYear(year);
	d.setMonth(month - 1);
	d.setDate(date);
	d.setHours(hours);
	d.setMinutes(minutes);
	d.setSeconds(seconds);
	d.setMilliseconds(miliseconds);

	return d.getTime();
};

/**
 * Transforms the illumination data into `timestamp` objects
 * when the illumination is turned on/off.
 */
const getScheduleData = (): ScheduleDataItem[] => {
	// assuming the previous year last entry is the same
	const result: ScheduleDataItem[] = [
		{
			lights: true,
			timestamp: getTimestamp(currentYear - 1, 12, 31, schedule[schedule.length - 1][3], schedule[schedule.length - 1][4])
		}
	];

	for (const item of schedule) {
		const [ month, dateFrom, dateTo, hoursOff, minutesOff, hoursOn, minutesOn ] = item;
	
		for (let date = dateFrom; date <= dateTo; date++) {
			result.push(
				{
					lights: false,
					timestamp: getTimestamp(currentYear, month, date, hoursOn, minutesOn)
				},
				{
					lights: true,
					timestamp: getTimestamp(currentYear, month, date, hoursOff, minutesOff)
				}
			);
		}
	}

	// assuming the next year first entry is the same
	result.push({
		lights: true,
		timestamp: getTimestamp(currentYear + 1, 1, 1, schedule[0][5], schedule[0][6])
	});

	return result;
};

export const scheduleIntervals = getScheduleData();
