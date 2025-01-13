import type {
	IlluminationState,
	LightsCity,
	LightsEvent,
	LightsSchedule
} from "types";

export interface CityLightsSchedule {
	city: LightsCity;
	getter: (date: Date) => number;
	schedule: number[];
	year: number;
}

export interface LightsProvider {
	city: LightsCity;
	getEventsByDate: (input?: Date) => LightsEvent[];
	getScheduleByDate: (input?: Date) => LightsSchedule;
	getStateByDate: (input?: Date) => IlluminationState;
	year: number;
}
