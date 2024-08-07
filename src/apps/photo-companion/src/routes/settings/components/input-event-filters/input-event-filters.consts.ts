import type { LightsEventName, MoonEventName, SunEventName } from "types";

export const LIGHTS_EVENT_NAMES: LightsEventName[] = [
	"LIGHTS_START",
	"LIGHTS_END"
];

export const MOON_EVENT_NAMES: MoonEventName[] = [
	"MOONRISE",
	"MOONSET"
];

export const SUN_EVENT_NAMES: SunEventName[] = [
	"NADIR",
	"ASTRONOMICAL_DAWN",
	"NAUTICAL_DAWN",
	"BLUE_HOUR_START_DAWN",
	"CIVIL_DAWN",
	"BLUE_HOUR_END_DAWN",
	"GOLDEN_HOUR_START_DAWN",
	"SUNRISE_START",
	"SUNRISE_END",
	"GOLDEN_HOUR_END_DAWN",
	"SOLAR_NOON",
	"GOLDEN_HOUR_START_DUSK",
	"SUNSET_START",
	"SUNSET_END",
	"GOLDEN_HOUR_END_DUSK",
	"BLUE_HOUR_START_DUSK",
	"CIVIL_DUSK",
	"BLUE_HOUR_END_DUSK",
	"NAUTICAL_DUSK",
	"ASTRONOMICAL_DUSK"
];
