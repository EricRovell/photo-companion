import type { UserLang, NavigationTabName } from "@lib/types";
import { detectUserLanguage } from "@lib/helpers";
import { persistable } from "@lib/helpers/persistable";
import type {
	BridgeEventName,
	LightsCity,
	LightsEventName,
	MoonEventName,
	SunEventName
} from "types";

/**
 * Events:
 * 
 * `key` is an event group name.
 * 
 *  `value` is:
 *  1. Empty array — all events are allowed for this group;
 *  2. `null` — all events are forbidden for this group;
 *  3. Non-empty array — the forbidden events are listed.
 */
export interface SettingsStore {
	bridges_spb_navigation: boolean;
	events_bridges_spb: Nullish<BridgeEventName[]>;
	events_lights: Nullish<LightsEventName[]>;
	events_moon: Nullish<MoonEventName[]>;
	events_sun: Nullish<SunEventName[]>;
	language: UserLang;
	latitude: number;
	lights_city: LightsCity;
	longitude: number;
	tabs: NavigationTabName[];
}

export const SETTINGS_DEFAULT: SettingsStore = Object.freeze({
	bridges_spb_navigation: true,
	events_bridges_spb: [],
	events_lights: [],
	events_moon: [],
	events_sun: [],
	language: detectUserLanguage(),
	latitude: 59.844404,
	lights_city: "SAINT_PETERSBURG",
	longitude: 30.3131,
	tabs: [ "TIMELINE", "LIGHTS", "SUN", "MOON" ] as NavigationTabName[]
});

const SETTINGS_LOCAL_STORAGE_KEY = "settings";
const SETTINGS_LOCAL_STORAGE_VERSION = 2;

export const settingsStore = persistable<SettingsStore>(
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION,
	SETTINGS_DEFAULT
);
