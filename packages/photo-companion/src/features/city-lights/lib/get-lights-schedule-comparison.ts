import type { LightsSchedule } from "types";

import { getClockDifference } from "./get-clock-difference";

const MILLISECONDS_PER_MINUTE = 60 * 1000;

export interface LightsScheduleComparison {
	durationMinutes: number;
	endMinutes: number;
	startMinutes: number;
}

export function getLightsScheduleComparison(
	current: LightsSchedule,
	previous: LightsSchedule
): LightsScheduleComparison | null {
	if (current.status !== "SCHEDULED" || previous.status !== "SCHEDULED") {
		return null;
	}

	return {
		durationMinutes: Math.round((current.duration - previous.duration) / MILLISECONDS_PER_MINUTE),
		endMinutes: getClockDifference(current.LIGHTS_END, previous.LIGHTS_END),
		startMinutes: getClockDifference(current.LIGHTS_START, previous.LIGHTS_START)
	};
}
