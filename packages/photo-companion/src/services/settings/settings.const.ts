import { detectUserLanguage } from "~/helpers";

import type { CitySettingsPreset, SettingsStore } from "./settings.types";
import type { ROUTE_PRIMARY_LABEL } from "~/services/navigation";

export const SETTINGS_LOCAL_STORAGE_KEY = "settings";
export const SETTINGS_LOCAL_STORAGE_VERSION = 4;

export const SETTINGS_DEFAULT: Readonly<SettingsStore> = Object.freeze({
	city: "SAINT_PETERSBURG",
	events_bridges_spb: [],
	events_lights: [],
	events_moon: [],
	events_sun: [],
	language: detectUserLanguage(),
	latitude: 59.844404,
	longitude: 30.3131,
	tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON", "BRIDGES", "HEIGHT_BY_SHADOW" ] as ROUTE_PRIMARY_LABEL[]
});

/**
 * City-specific settings presets.
 */
export const SETTINGS_CITY_PRESETS: Record<SettingsStore["city"], CitySettingsPreset> = {
	MOSCOW: {
		city: "MOSCOW",
		latitude: 55.755826,
		longitude: 37.617299,
		tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON", "HEIGHT_BY_SHADOW" ]
	},
	OTHER: {
		city: "OTHER",
		latitude: 59.844404,
		longitude: 30.3131,
		tabs: [ "NOW", "TIMELINE", "SUN", "MOON", "HEIGHT_BY_SHADOW" ]
	},
	SAINT_PETERSBURG: {
		city: "SAINT_PETERSBURG",
		latitude: 59.844404,
		longitude: 30.3131,
		tabs: [ "NOW", "TIMELINE", "LIGHTS", "SUN", "MOON", "BRIDGES", "HEIGHT_BY_SHADOW" ]
	}
};
