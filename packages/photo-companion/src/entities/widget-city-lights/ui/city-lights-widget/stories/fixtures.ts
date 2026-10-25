import type { City, LightsSchedule, LightsScheduleSource, LightsScheduleStatus } from "types";

import type { CityLightsWidgetProps } from "../../../types";

export interface StoryArgs {
	city: City;
	hour: number;
	offHour: number;
	onHour: number;
	source: LightsScheduleSource;
	status: LightsScheduleStatus;
	uncertaintyMinutes: number;
	width: number;
}

interface ScenarioOptions extends Partial<StoryArgs> {
	missingNextEvent?: boolean;
	nextDayOffHour?: number;
}

export const defaults: StoryArgs = {
	city: "MOSCOW",
	hour: 20 + 40 / 60,
	offHour: 6 + 10 / 60,
	onHour: 18 + 20 / 60,
	source: "SCHEDULE",
	status: "SCHEDULED",
	uncertaintyMinutes: 30,
	width: 560
};

function at(date: Date, hour: number) {
	const result = new Date(date);
	result.setHours(Math.floor(hour), Math.round(hour % 1 * 60), 0, 0);
	return result;
}

function createScheduleScenario(options: ScenarioOptions): Omit<CityLightsWidgetProps, "solar"> {
	const args = {
		...defaults,
		...options
	};

	const date = at(new Date(2026, 9, 24), args.hour);

	const getScheduleForDate = (day: Date): LightsSchedule => {
		const metadata = {
			source: args.source,
			uncertaintyMinutes: args.source === "SOLAR_ESTIMATE" ? args.uncertaintyMinutes : 0
		};

		if (args.status !== "SCHEDULED") {
			return {
				...metadata,
				duration: null,
				LIGHTS_END: null,
				LIGHTS_START: null,
				status: args.status
			};
		}
		const LIGHTS_START = at(day, args.onHour).getTime();
		const LIGHTS_END = at(day, day.getDate() === 25 ? options.nextDayOffHour ?? args.offHour : args.offHour).getTime();

		return {
			...metadata,
			duration: (24 + args.offHour - args.onHour) * 3_600_000,
			LIGHTS_END,
			LIGHTS_START,
			status: "SCHEDULED"
		};
	};

	const schedule = getScheduleForDate(date);

	if (schedule.status !== "SCHEDULED") {
		return {
			city: args.city,
			date,
			getScheduleForDate,
			schedule,
			state: {
				event: null,
				lights: schedule.status === "CONTINUOUS_DARKNESS",
				timestamp: null
			}
		};
	}

	const morning = date.getTime() < schedule.LIGHTS_END;
	const evening = date.getTime() >= schedule.LIGHTS_START;
	const nextDay = new Date(date);
	nextDay.setDate(nextDay.getDate() + 1);
	const nextSchedule = getScheduleForDate(nextDay);
	const timestamp = morning ? schedule.LIGHTS_END : evening ? nextSchedule.LIGHTS_END : schedule.LIGHTS_START;

	return {
		city: args.city,
		date,
		getScheduleForDate,
		schedule,
		state: {
			event: options.missingNextEvent ? null : morning || evening ? "LIGHTS_END" : "LIGHTS_START",
			lights: morning || evening,
			timestamp: options.missingNextEvent ? null : timestamp
		}
	};
}

export function createScenario(options: ScenarioOptions = {}): CityLightsWidgetProps {
	return {
		...createScheduleScenario(options),
		solar: createScheduleScenario({
			...options,
			source: "SOLAR_ESTIMATE"
		})
	};
}

export const edgeScenarios: { description: string;
options: ScenarioOptions;
title: string }[] = [
	{
		description: "Countdown to switch-on while the lights are off.",
		options: { hour: 15 },
		title: "Before switch-on"
	},
	{
		description: "The selected marker and turn-on time coincide.",
		options: { hour: defaults.onHour },
		title: "Exactly at switch-on"
	},
	{
		description: "The previous evening remains paired with this morning.",
		options: { hour: 28 },
		title: "After midnight"
	},
	{
		description: "The selected marker and turn-off time coincide.",
		options: { hour: 24 + defaults.offHour },
		title: "Exactly at switch-off"
	},
	{
		description: "The new night starts at noon; the selected label stays inside the card.",
		options: { hour: 12 },
		title: "Noon boundary"
	},
	{
		description: "The selected label remains readable at the far end of the plot.",
		options: { hour: 35.99 },
		title: "Just before noon"
	},
	{
		description: "Nearby switch ticks stay at their time positions; exact times appear on hover or link focus.",
		options: {
			hour: 24,
			offHour: 0.25,
			onHour: 23.75
		},
		title: "Thirty-minute night"
	},
	{
		description: "Switch ticks remain visible near the plot edges, and their tooltips stay inside the card.",
		options: {
			hour: 24,
			offHour: 11.9,
			onHour: 12.1
		},
		title: "Almost continuous lighting"
	},
	{
		description: "The following morning uses its own schedule.",
		options: { nextDayOffHour: 7.25 },
		title: "Morning schedule changes"
	},
	{
		description: "The selected time falls in the ±30-minute switching band.",
		options: {
			city: "OTHER",
			hour: 18.1,
			source: "SOLAR_ESTIMATE"
		},
		title: "Inside an estimate window"
	},
	{
		description: "Overlapping uncertainty bands do not imply a definite illuminated interval.",
		options: {
			city: "OTHER",
			hour: 24,
			offHour: 0.25,
			onHour: 23.75,
			source: "SOLAR_ESTIMATE",
			uncertaintyMinutes: 60
		},
		title: "Overlapping estimate windows"
	},
	{
		description: "A band remains visible when its nominal switch is outside the plot.",
		options: {
			city: "OTHER",
			hour: 12.1,
			offHour: 11.7,
			source: "SOLAR_ESTIMATE",
			uncertaintyMinutes: 60
		},
		title: "Estimate crosses noon"
	},
	{
		description: "An unavailable next event shows a dash instead of a countdown.",
		options: { missingNextEvent: true },
		title: "No next event"
	},
	{
		description: "No switch markers or invented times during continuous daylight.",
		options: {
			city: "OTHER",
			source: "SOLAR_ESTIMATE",
			status: "CONTINUOUS_DAYLIGHT"
		},
		title: "Continuous daylight"
	},
	{
		description: "The bulb stays on without a fabricated switching time.",
		options: {
			city: "OTHER",
			source: "SOLAR_ESTIMATE",
			status: "CONTINUOUS_DARKNESS"
		},
		title: "Continuous darkness"
	},
	{
		description: "Unavailable data has an explicit state and no graph.",
		options: { status: "UNAVAILABLE" },
		title: "Schedule unavailable"
	}
];
