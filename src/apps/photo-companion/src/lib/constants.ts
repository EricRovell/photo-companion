import type { SettingsStore } from "./types";

export const LIGHTS_SCHEDULE_DATE = 2024;

// Saint-Petersburg, Russia
export const LAT = 59.844404;
export const LON = 30.3131;

export const title = "Photo Companion";
export { version } from "../../package.json";

export const SETTINGS_LOCAL_STORAGE_KEY = "settings";

export const SETTINGS_DEFAULT: SettingsStore = Object.freeze({
	lat: LAT,
	lon: LON
});
