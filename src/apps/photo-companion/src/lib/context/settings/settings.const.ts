import { detectUserLanguage } from "@lib/helpers";

import type { SettingsStore } from "./settings.types";
import type { NavigationTabName } from "@lib/types";

export const SETTINGS_LOCAL_STORAGE_KEY = "settings";
export const SETTINGS_LOCAL_STORAGE_VERSION = 2;

export const SETTINGS_DEFAULT: Readonly<SettingsStore> = Object.freeze({
	bridges_spb_navigation: true,
	events_bridges_spb: [],
	events_lights: [],
	events_moon: [],
	events_sun: [],
	language: detectUserLanguage(),
	latitude: 59.844404,
	lights_city: "SAINT_PETERSBURG",
	longitude: 30.3131,
	tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON" ] as NavigationTabName[]
});
