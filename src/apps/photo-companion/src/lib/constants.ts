import type { LightsCity, LightsEventName, MoonEventName, SunEventName } from "@shared/types";
import type { EventGroupName, SettingsStore } from "./types";

export const LIGHTS_SCHEDULE_DATE = 2024;

// Saint-Petersburg, Russia
export const LAT = 59.844404;
export const LON = 30.3131;

export const title = "Photo Companion";
export { version } from "../../package.json";

export const lightsCityList: LightsCity[] = [
	"moscow",
	"saint-petersburg"
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
	"moonrise",
	"moonset"
];

export const LIGHTS_EVENT_NAMES: LightsEventName[] = [
	"lights:start",
	"lights:end"
];

export const SUN_EVENT_NAMES: SunEventName[] = [
	"nadir",
	"astronomical:dawn",
	"nautical:dawn",
	"blue-hour:dawn:start",
	"civil:dawn",
	"blue-hour:dawn:end",
	"golden-hour:dawn:start",
	"sunrise:start",
	"sunrise:end",
	"golden-hour:dawn:end",
	"solar-noon",
	"golden-hour:dusk:start",
	"sunset:start",
	"sunset:end",
	"golden-hour:dusk:end",
	"blue-hour:dusk:start",
	"civil:dusk",
	"blue-hour:dusk:end",
	"nautical:dusk",
	"astronomical:dusk"
];

export const SETTINGS_DEFAULT: SettingsStore = Object.freeze({
	"events-lights": [],
	"events-moon": [],
	"events-sun": [],
	"latitude": LAT,
	"lights-city": "saint-petersburg",
	"longitude": LON,
	"starting-page": "/timeline"
});
