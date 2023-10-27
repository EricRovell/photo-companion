import { schedule } from "../../data/data";
import { getTimestamp } from "./schedule-intervals";
import { currentYear } from "../constants";

interface ScheduleState {
	timestampOn: number;
	timestampOff: number;
}

/**
 * Returns the current illumination state.
 */
export const getScheduleStateByDate = (timestamp: number): ScheduleState | null => {
	const queryDate = new Date(timestamp);
	const query = {
		month: queryDate.getMonth() + 1,
		date: queryDate.getDate(),
		hours: queryDate.getHours(),
		minutes: queryDate.getMinutes()
	};

	for (let i = 0; i < schedule.length; i++) {
		const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = schedule[i];

		if (month !== query.month) {
			continue;
		}

		if (query.date > dateTo || query.date < dateFrom) {
			continue;
		}

		return {
			timestampOff: getTimestamp(currentYear, month, query.date, hoursOff, minutesOff),
			timestampOn: getTimestamp(currentYear, month, query.date, hoursOn, minutesOn)
		};
	}

	return null;
};
