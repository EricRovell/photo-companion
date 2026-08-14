/* eslint-disable perfectionist/sort-union-types */

export type BridgeName =
	| "ALEXANDER_NEVSKY"
	| "ANNUNCIATION"
	| "BOLSHEOKHTINSKY"
	| "EXCHANGE"
	| "GRENADERSKY"
	| "KANTEMIROVSKY"
	| "LITEYNY"
	| "PALACE"
	| "SAMPSONIEVSKY"
	| "TRINITY"
	| "TUCHKOV"
	| "VOLODARSKY";

export type BridgeEventName = `${BridgeName}_${"OPEN" | "CLOSE"}`;

export type LightsEventName =
	| "LIGHTS_END"
	| "LIGHTS_START";

export interface ScheduleDataItem {
	event: LightsEventName;
	lights: boolean;
	timestamp: number
}

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}

export interface LightsSchedule {
	duration: number;
	LIGHTS_END: number;
	LIGHTS_START: number;
}

export interface IlluminationState {
	event: LightsEventName;
	lights: boolean;
	timestamp: number;
}

export type City =
	| "MOSCOW"
	| "OTHER"
	| "SAINT_PETERSBURG";

export type LightsCity = Exclude<City, "OTHER">;

export interface ScheduleDataItem {
	event: LightsEventName;
	lights: boolean;
	timestamp: number
}

export interface Event<
	Type extends string,
	Name extends string,
	Data = Partial<Record<string, never>>
> {
	data: Data;
	name: Name;
	timestamp: number;
	type: Type;
}

export type BridgeEvent = Event<"BRIDGE", BridgeEventName, {
	bridgeName: BridgeName;
	open: boolean;
}>;

export type LightsEvent = Event<"LIGHTS", LightsEventName, {
	city: LightsCity
}>;

export type Locale = "en" | "ru";
