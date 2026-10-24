import type { LightsNightEvent } from "lights-schedule";
import type { City, IlluminationState, LightsEventName, LightsSchedule } from "types";

export interface CityLightsWidgetProps {
	city: City;
	date: Date;
	getScheduleForDate: (date: Date) => LightsSchedule;
	schedule: LightsSchedule;
	state: IlluminationState;
}

export interface CityLightsNightEvent extends Pick<LightsNightEvent, "name" | "timestamp" | "uncertaintyMinutes"> {
	position: number;
	windowEnd: number;
	windowStart: number;
}

export interface CityLightsGraphLabel extends CityLightsNightEvent {
	edge?: "end" | "start";
	row: number;
}

interface CityLightsNightInterval {
	end: number;
	innerEnd: number;
	innerStart: number;
	start: number;
}

export interface CityLightsNight {
	end: Date;
	events: CityLightsNightEvent[];
	intervals: CityLightsNightInterval[];
	position: number;
	start: Date;
	ticks: {
		position: number;
		time: Date
	}[];
	windows: CityLightsNightEvent[];
}

export interface CityLightsEventData {
	day: string;
	label: string;
	name: LightsEventName;
	range: null | string;
	time: string;
}
