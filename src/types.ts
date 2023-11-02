export interface ScheduleDataItem {
	lights: boolean;
	timestamp: number
}

export type ScheduleRawData = [
	month: number,
	dateFrom: number,
	dateTo: number,
	hoursOff: number,
	minutesOff: number,
	hoursOn: number,
	minutesOn: number
];

export type SunEventName =
	|"dawn:astronomical"
	| "dawn:nautical"
	| "dawn:blue-hour:start"
	| "dawn:civil"
	| "dawn:blue-hour:end"
	| "dawn:golden-hour:start"
	| "sunrise:start"
	| "sunrise:end"
	| "dawn:golden-hour:end"
	| "solar-noon"
	| "dusk:golden-hour:start"
	| "sunset:start"
	| "sunset:end"
	| "dusk:golden-hour:end"
	| "dusk:blue-hour:start"
	| "dusk:civil"
	| "dusk:blue-hour:end"
	| "dusk:nautical"
	| "dusk:astronomical"
	| "nadir";

export type MoonEventName =
	| "moonrise"
	| "moonset";

export type IlluminationEventName =
	| "lights:start"
	| "light:end";
