import type { LightsNightEvent } from "lights-schedule";
import type { JSX } from "solid-js";
import type { City, IlluminationState, LightsEventName, LightsSchedule } from "types";

interface CityLightsScheduleData {
	getScheduleForDate: (date: Date) => LightsSchedule;
	schedule: LightsSchedule;
	state: IlluminationState;
}

export interface CityLightsWidgetProps extends CityLightsScheduleData {
	city: City;
	date: Date;
	renderTime?: CityLightsTimeRenderer;
	solar: CityLightsScheduleData;
}

export type CityLightsTimeRenderer = (date: Date, children: JSX.Element, label: string) => JSX.Element;

export interface CityLightsNightEvent extends Pick<LightsNightEvent, "name" | "timestamp" | "uncertaintyMinutes"> {
	position: number;
	windowEnd: number;
	windowStart: number;
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
	date: Date | null;
	day: string;
	label: string;
	name: LightsEventName;
	range: null | string;
	time: string;
}
