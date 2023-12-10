import type { ComponentType } from "svelte";

export type BridgeName =
	| "alexander-nevsky"
	| "annunciation"
	| "exchange"
	| "bolsheokhtinsky"
	| "volodarsky"
	| "palace"
	| "liteyny"
	| "trinity"
	| "tuchkov"
	| "sampsonievsky"
	| "grenadersky"
	| "kantemirovsky";

export type MoonPhaseName =
	| "new-moon"
	| "waxing-crescent"
	| "first-quarter"
	| "waxing-gibbous"
	| "full-moon"
	| "waning-gibbous"
	| "third-quarter"
	| "waning-crescent";

export type SunEventName =
	| "dawn:astronomical"
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
	| "lights:end";

export type SunColor =
	| "astronomical"
	| "nautical"
	| "blue-hour"
	| "civil"
	| "golden-hour"
	| "day"
	| "night";

export interface ScheduleDataItem {
	lights: boolean;
	event: LightsEventName;
	timestamp: number
}

export type EventName =
	| LightsEventName
	| SunEventName
	| MoonEventName;

export interface Event<Name extends string, Data = Partial<Record<string, never>>> {
	name: Name;
	timestamp: number;
	data: Data;
}

export type LightsEvent = Event<LightsEventName>;

export type MoonEvent = Event<MoonEventName, {
	phase: number,
	waxing: boolean,
	fraction: number;
	zenithAngle: number;
}>;

export type SunEvent = Event<SunEventName, {
	azimuth: number,
	elevation: number;
}>;

export type TimelineEvent = LightsEvent | MoonEvent | SunEvent;

export interface TimelineEntry {
	date: Date;
	items: TimelineEvent[];
}

export interface EventComponent<Props> {
	component: ComponentType;
	props: Props;
	message?: string;
	title: string;
	type: "lights" | "moon" | "sun";
}

export type BridgeShedule = Array<[
	hoursOpen: number,
	minutesOpen: number,
	hoursClose: number,
	minutesClose: number
]>;

export interface NavigationSchedule {
	// the date the schedule was updated
	year: number;
	// the navigation period dates
	navigation: [
		monthStart: number,
		dateStart: number,
		monthEnd: number,
		dateEnd: number
	],
	exception: Array<BridgeName>;
	shedule: Record<BridgeName, BridgeShedule>;
}

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}
