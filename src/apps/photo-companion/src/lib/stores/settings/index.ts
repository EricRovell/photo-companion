import { persistable } from "../../helpers/persistable";
import type {
	BridgeEventName,
	LightsCity,
	LightsEventName,
	MoonEventName,
	SunEventName
} from "@shared/types";

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
	bridges_spb: "navigation" | "always" | null;
	events_bridges_spb: BridgeEventName[] | null;
	events_lights: LightsEventName[] | null;
	events_moon: MoonEventName[] | null;
	events_sun: SunEventName[] | null;
	latitude: number;
	lights_city: Nullable<LightsCity>;
	longitude: number;
	starting_page: string;
}

export const SETTINGS_DEFAULT: SettingsStore = Object.freeze({
	bridges_spb: "navigation",
	events_bridges_spb: [],
	events_lights: [],
	events_moon: [],
	events_sun: [],
	latitude: 59.844404,
	lights_city: "SAINT_PETERSBURG",
	longitude: 30.3131,
	starting_page: "/timeline"
});

const SETTINGS_LOCAL_STORAGE_KEY = "settings";
const SETTINGS_LOCAL_STORAGE_VERSION = 1;

export const settingsStore = persistable<SettingsStore>(
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION,
	SETTINGS_DEFAULT
);
