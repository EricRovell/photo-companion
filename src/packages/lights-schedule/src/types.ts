import type {
	IlluminationState,
	LightsCity,
	LightsSchedule,
	LightsEvent
} from "@shared/types";

export interface CityLightsSchedule {
	year: number;
	city: LightsCity;
	schedule: number[];
	getter: (date: Date) => number;
}

export interface LightsProvider {
	city: LightsCity;
	getEventsByDate: (input?: Date) => LightsEvent[];
	getScheduleByDate: (input?: Date) => LightsSchedule;
	getStateByDate: (input?: Date) => IlluminationState;
	year: number;
}
