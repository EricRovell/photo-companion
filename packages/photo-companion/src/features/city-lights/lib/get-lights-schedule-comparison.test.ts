import { describe, expect, it } from "vitest";

import type { LightsSchedule } from "types";

import { getLightsScheduleComparison } from "./get-lights-schedule-comparison";

const MINUTE = 60 * 1000;

function getSchedule(
	start: [ hours: number, minutes: number ],
	end: [ hours: number, minutes: number ],
	duration: number
): LightsSchedule {
	return {
		duration: duration * MINUTE,
		LIGHTS_END: new Date(2026, 0, 2, ...end).getTime(),
		LIGHTS_START: new Date(2026, 0, 2, ...start).getTime(),
		source: "SCHEDULE",
		status: "SCHEDULED",
		uncertaintyMinutes: 0
	};
}

describe("getLightsScheduleComparison", () => {
	it("returns zero differences for an unchanged schedule", () => {
		const schedule = getSchedule([ 16, 20 ], [ 8, 30 ], 970);

		expect(getLightsScheduleComparison(schedule, schedule)).toEqual({
			durationMinutes: 0,
			endMinutes: 0,
			startMinutes: 0
		});
	});

	it("compares both boundaries and duration independently", () => {
		const previous = getSchedule([ 16, 20 ], [ 8, 30 ], 970);
		const current = getSchedule([ 16, 25 ], [ 8, 25 ], 960);

		expect(getLightsScheduleComparison(current, previous)).toEqual({
			durationMinutes: -10,
			endMinutes: -5,
			startMinutes: 5
		});
	});
});
