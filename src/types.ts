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

export type LightsEventName =
	| "lights:start"
	| "light:end";

export type EventName =
	| LightsEventName
	| SunEventName
	| MoonEventName;

export interface ScheduleDataItem {
	lights: boolean;
	event: LightsEventName;
	timestamp: number
}
