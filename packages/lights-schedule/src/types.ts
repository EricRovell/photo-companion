import type {
	City,
	IlluminationState,
	LightsCity,
	LightsEvent,
	LightsEventName,
	LightsSchedule,
	LightsScheduleSource
} from "types";

export interface CityLightsSchedule {
	city: LightsCity;
	getter: (date: Date) => number;
	schedule: number[];
	year: number;
}

export interface LightsProvider {
	city: City;
	getEventsByDate: (input?: Date) => LightsEvent[];
	getScheduleByDate: (input?: Date) => LightsSchedule;
	getStateByDate: (input?: Date) => IlluminationState;
	source: LightsScheduleSource;
	year: null | number;
}

export interface LightsNightEvent {
	name: LightsEventName;
	timestamp: number;
	uncertaintyMinutes: number;
	/** Unclipped uncertainty bounds, in milliseconds since the Unix epoch. */
	windowEnd: number;
	windowStart: number;
}

export interface LightsNightInterval {
	/** Null when no following switch-off is available in the adjacent schedules. */
	end: LightsNightEvent | null;
	start: LightsNightEvent;
}

export interface LightsNight {
	/** Lights-on duration within the noon-to-noon bounds, in milliseconds. */
	duration: number;
	end: Date;
	events: LightsNightEvent[];
	intervals: LightsNightInterval[];
	start: Date;
	/** Includes uncertainty windows overlapping the night even if their switch is outside it. */
	windows: LightsNightEvent[];
}

export interface SolarLightsLocation {
	latitude: number;
	longitude: number;
}

export interface SolarAltitudeModel {
	base: readonly number[];
	latitudeAdjustment: readonly number[];
}
