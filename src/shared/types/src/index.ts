export type BridgeName =
	| "ALEXANDER_NEVSKY"
	| "ANNUNCIATION"
	| "EXCHANGE"
	| "BOLSHEOKHTINSKY"
	| "VOLODARSKY"
	| "PALACE"
	| "LITEYNY"
	| "TRINITY"
	| "TUCHKOV"
	| "SAMPSONIEVSKY"
	| "GRENADERSKY"
	| "KANTEMIROVSKY";

export type MoonPhaseName =
	| "NEW_MOON"
	| "WAXING_CRESCENT"
	| "FIRST_QUARTER"
	| "WAXING_GIBBOUS"
	| "FULL_MOON"
	| "WANING_GIBBOUS"
	| "THIRD_QUARTER"
	| "WANING_CRESCENT";

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
	| "LIGHTS_START"
	| "LIGHTS_END";

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

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}

export interface LightsSchedule {
	// duration of the lights turned on in seconds
	duration: number;
	"LIGHTS_START": number;
	"LIGHTS_END": number;
}

export interface IlluminationState {
	lights: boolean;
	event: LightsEventName;
	timestamp: number;
}

export type LightsCity =
	| "SAINT_PETERSBURG"
	| "MOSCOW";

export interface ScheduleDataItem {
	lights: boolean;
	event: LightsEventName;
	timestamp: number
}

export interface Event<Name extends string, Data = Partial<Record<string, never>>> {
	data: Data;
	name: Name;
	secondary?: boolean;
	timestamp: number;
}

export type LightsEvent = Event<LightsEventName, { city: LightsCity }>;

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

