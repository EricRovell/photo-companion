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
	// Sun is in the highest position)
	| "solar-noon"
	// The Darkest moment of the night, sun is in the lowest position
	| "nadir"
	// Soft light, best time for photography
	| "golden-hour:dawn:start"
	// Soft light, best time for photography
	| "golden-hour:dawn:end"
	// The sun-time for evening golden hour starts
	| "golden-hour:dusk:start"
	// The sun-time for evening golden hour starts
	| "golden-hour:dusk:end"
	// Top edge of the sun appears on the horizon)
	| "sunrise:start"
	// Bottom edge of the sun touches the horizon)
	| "sunrise:end"
	// Bottom edge of the sun touches the horizon)
	| "sunset:start"
	// Sun disappears below the horizon, evening civil twilight starts
	| "sunset:end"
	// Time for special photography photos starts
	| "blue-hour:dawn:start"
	// Time for special photography photos ends
	| "blue-hour:dawn:end"
	// Time for special photography photos starts
	| "blue-hour:dusk:start"
	// Time for special photography photos ends
	| "blue-hour:dusk:end"
	// Morning nautical twilight ends, morning civil twilight starts
	| "civil:dawn"
	// Evening nautical twilight starts
	| "civil:dusk"
	// Morning nautical twilight starts
	| "nautical:dawn"
	// Evening astronomical twilight starts
	| "nautical:dusk"
	// The sun-time for night ends (morning astronomical twilight starts)
	| "astronomical:dawn"
	// The sun-time for night starts (dark enough for astronomical observations)
	| "astronomical:dusk";

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

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}

export interface LightsSchedule {
	// duration of the lights turned on in seconds
	duration: number;
	"lights:start": number;
	"lights:end": number;
}

export interface IlluminationState {
	lights: boolean;
	event: LightsEventName;
	timestamp: number;
}

export type LightsCity =
	| "saint-petersburg"
	| "moscow";

export interface ScheduleDataItem {
	lights: boolean;
	event: LightsEventName;
	timestamp: number
}

export interface Event<Name extends string, Data = Partial<Record<string, never>>> {
	name: Name;
	timestamp: number;
	data: Data;
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

