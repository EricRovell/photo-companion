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

export type LightsScheduleSource =
	| "SCHEDULE"
	| "SOLAR_ESTIMATE";

export type LightsScheduleStatus =
	| "CONTINUOUS_DARKNESS"
	| "CONTINUOUS_DAYLIGHT"
	| "SCHEDULED"
	| "UNAVAILABLE";

interface LightsScheduleMetadata {
	source: LightsScheduleSource;
	uncertaintyMinutes: number;
}

export interface ScheduledLightsSchedule extends LightsScheduleMetadata {
	duration: number;
	LIGHTS_END: number;
	LIGHTS_START: number;
	status: "SCHEDULED";
}

export interface UnscheduledLightsSchedule extends LightsScheduleMetadata {
	duration: null;
	LIGHTS_END: null;
	LIGHTS_START: null;
	status: Exclude<LightsScheduleStatus, "SCHEDULED">;
}

export type LightsSchedule = ScheduledLightsSchedule | UnscheduledLightsSchedule;

export interface IlluminationState {
	event: LightsEventName | null;
	lights: boolean;
	timestamp: number | null;
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
	city: City;
	source: LightsScheduleSource;
}>;

export type Locale = "en" | "ru";
