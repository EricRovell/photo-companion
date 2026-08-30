import type {
	City,
	IlluminationState,
	LightsCity,
	LightsEvent,
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

export interface SolarLightsLocation {
	latitude: number;
	longitude: number;
}

export interface SolarAltitudeModel {
	base: readonly number[];
	latitudeAdjustment: readonly number[];
}
