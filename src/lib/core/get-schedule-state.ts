import { type ScheduleDataItem } from "../../types";

/**
 * Returns the current illumination state.
 */
export const getScheduleState = (timestamp: number, data: ScheduleDataItem[]) => {
	for (let i = 0; i < data.length; i++) {
		const left = data[i];
		const right = data[i + 1];

		if (timestamp >= left.timestamp && timestamp < right.timestamp) {
			return {
				lights: left.lights,
				timestamp: right.timestamp
			};
		}
	}

	return null;
};

/**
 * Returns the illumination schedule by given date.
 */
export const getScheduleStateByDay = (timestamp: number, data: ScheduleDataItem[]) => {
	for (let i = 0; i < data.length; i++) {
		const left = data[i];
		const right = data[i + 1];

		if (timestamp >= left.timestamp && timestamp < right.timestamp) {
			return {
				timestampOn: left.timestamp,
				timestampOff: right.timestamp
			};
		}
	}

	return null;
};
