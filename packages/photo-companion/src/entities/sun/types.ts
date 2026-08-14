import type { SunEventName as AstronomicalSunEventName } from "moon-sun-calc";

export type SunEventName = AstronomicalSunEventName;

export type SunColor =
	| "astronomical"
	| "blue-hour"
	| "civil"
	| "day"
	| "golden-hour"
	| "nautical"
	| "night";
