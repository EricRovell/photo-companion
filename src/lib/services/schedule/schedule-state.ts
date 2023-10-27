import { scheduleIntervals } from "./schedule-intervals";

/**
 * Returns the current illumination state.
 */
export const getScheduleState = (timestamp: number) => {
	for (let i = 0; i < scheduleIntervals.length; i++) {
		const left = scheduleIntervals[i];
		const right = scheduleIntervals[i + 1];

		if (timestamp >= left.timestamp && timestamp < right.timestamp) {
			return {
				lights: left.lights,
				timestamp: right.timestamp
			};
		}
	}

	return null;
};
