import { detectUserLanguage } from "@lib/helpers";

import type { CitySettingsPreset, SettingsStore } from "./settings.types";
import type { NavigationTabName } from "@lib/types";

export const SETTINGS_LOCAL_STORAGE_KEY = "settings";
export const SETTINGS_LOCAL_STORAGE_VERSION = 3;

export const SETTINGS_DEFAULT: Readonly<SettingsStore> = Object.freeze({
	city: "SAINT_PETERSBURG",
	events_bridges_spb: [],
	events_lights: [],
	events_moon: [],
	events_sun: [],
	language: detectUserLanguage(),
	latitude: 59.844404,
	longitude: 30.3131,
	tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON", "BRIDGES" ] as NavigationTabName[]
});

/**
 * City-specific settings presets.
 */
export const SETTINGS_CITY_PRESETS: Record<SettingsStore["city"], CitySettingsPreset> = {
	MOSCOW: {
		city: "MOSCOW",
		latitude: 55.755826,
		longitude: 37.617299,
		tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON" ]
	},
	OTHER: {
		city: "OTHER",
		latitude: 59.844404,
		longitude: 30.3131,
		tabs: [ "NOW", "TIMELINE", "SUN", "MOON" ]
	},
	SAINT_PETERSBURG: {
		city: "SAINT_PETERSBURG",
		latitude: 59.844404,
		longitude: 30.3131,
		tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON", "BRIDGES" ]
	}
};
