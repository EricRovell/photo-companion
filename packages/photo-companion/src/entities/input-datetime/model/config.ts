import type { DateTimeStep, InputDatetimeLabels } from "../types";

export const DATETIME_CONFIG = {
	defaultLabels: {
		DATETIME: "Date and time",
		DATETIME_STEP: "Date and time step",
		DATETIME_TIMELINE: "Change date and time",
		DAY: "Day",
		HOUR: "Hour",
		MINUTE: "Minute",
		MONTH: "Month",
		NOW: "Now",
		OPEN_DATETIME_PICKER: "Open date and time picker",
		YEAR: "Year"
	} satisfies InputDatetimeLabels,
	fling: {
		maxSteps: 6,
		projectionMs: 220
	},
	spring: {
		damping: 26,
		maxDuration: 750,
		settleDistance: 0.25,
		settleVelocity: 4,
		stiffness: 180
	},
	steps: [ "minute", "hour", "day", "month", "year" ] satisfies DateTimeStep[],
	ticks: {
		count: 25,
		width: 96
	}
} as const;
