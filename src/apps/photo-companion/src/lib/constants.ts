import type { LightsCity, LightsEventName, MoonEventName, SunEventName } from "@shared/types";
import type { EventGroupName, SettingsStore } from "./types";

export const LIGHTS_SCHEDULE_DATE = 2024;

// Saint-Petersburg, Russia
export const LAT = 59.844404;
export const LON = 30.3131;

export const title = "Photo Companion";
export { version } from "../../package.json";

export const lightsCityList: LightsCity[] = [
	"MOSCOW",
	"SAINT_PETERSBURG"
];

export const EVENT_GROUP_NAMES: EventGroupName[] = [
	"lights",
	"moon",
	"sun"
];

export function isEventGroupName(input: string): input is EventGroupName {
	return EVENT_GROUP_NAMES.includes(input as EventGroupName);
}

export const MOON_EVENT_NAMES: MoonEventName[] = [
	"MOONRISE",
	"MOONSET"
];

export const LIGHTS_EVENT_NAMES: LightsEventName[] = [
	"LIGHTS_START",
	"LIGHTS_END"
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

export const SETTINGS_DEFAULT: SettingsStore = Object.freeze({
	"bridges-spb": "navigation",
	"events-lights": [],
	"events-moon": [],
	"events-sun": [],
	"latitude": LAT,
	"lights-city": "SAINT_PETERSBURG",
	"longitude": LON,
	"starting-page": "/timeline"
});
