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

export type MoonPhaseName =
	| "FIRST_QUARTER"
	| "FULL_MOON"
	| "NEW_MOON"
	| "THIRD_QUARTER"
	| "WANING_CRESCENT"
	| "WANING_GIBBOUS"
	| "WAXING_CRESCENT"
	| "WAXING_GIBBOUS";

export type SunEventName =
	// Sun is in the highest position)
	| "SOLAR_NOON"
	// The Darkest moment of the night, sun is in the lowest position
	| "NADIR"
	// Soft light, best time for photography
	| "GOLDEN_HOUR_START_DAWN"
	// Soft light, best time for photography
	| "GOLDEN_HOUR_END_DAWN"
	// The sun-time for evening golden hour starts
	| "GOLDEN_HOUR_START_DUSK"
	// The sun-time for evening golden hour starts
	| "GOLDEN_HOUR_END_DUSK"
	// Top edge of the sun appears on the horizon)
	| "SUNRISE_START"
	// Bottom edge of the sun touches the horizon)
	| "SUNRISE_END"
	// Bottom edge of the sun touches the horizon)
	| "SUNSET_START"
	// Sun disappears below the horizon, evening civil twilight starts
	| "SUNSET_END"
	// Time for special photography photos starts
	| "BLUE_HOUR_START_DAWN"
	// Time for special photography photos ends
	| "BLUE_HOUR_END_DAWN"
	// Time for special photography photos starts
	| "BLUE_HOUR_START_DUSK"
	// Time for special photography photos ends
	| "BLUE_HOUR_END_DUSK"
	// Morning nautical twilight ends, morning civil twilight starts
	| "CIVIL_DAWN"
	// Evening nautical twilight starts
	| "CIVIL_DUSK"
	// Morning nautical twilight starts
	| "NAUTICAL_DAWN"
	// Evening astronomical twilight starts
	| "NAUTICAL_DUSK"
	// The sun-time for night ends (morning astronomical twilight starts)
	| "ASTRONOMICAL_DAWN"
	// The sun-time for night starts (dark enough for astronomical observations)
	| "ASTRONOMICAL_DUSK";

export type MoonEventName =
	| "MOONRISE"
	| "MOONSET";

export type LightsEventName =
	| "LIGHTS_END"
	| "LIGHTS_START";

export type SunColor =
	| "astronomical"
	| "blue-hour"
	| "civil"
	| "day"
	| "golden-hour"
	| "nautical"
	| "night";

export interface ScheduleDataItem {
	event: LightsEventName;
	lights: boolean;
	timestamp: number
}

export type EventName =
	| BridgeEventName
	| LightsEventName
	| MoonEventName
	| SunEventName;

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

export type EventGroupName =
	| "BRIDGE"
	| "LIGHTS"
	| "MOON"
	| "SUN";

export interface Event<
	Type extends EventGroupName,
	Name extends EventName,
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

export type MoonEvent = Event<"MOON", MoonEventName, {
	azimuth: string;
	fraction: string;
	phase: number,
	rotation: number;
	waxing: boolean,
}>;

export type SunEvent = Event<"SUN", SunEventName, {
	azimuth: string
}>;

export type TimelineEvent =
	BridgeEvent |
	LightsEvent |
	MoonEvent |
	SunEvent;

export type Locale = "en" | "ru";
