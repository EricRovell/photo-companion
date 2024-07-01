import type { Accessor, Setter } from "solid-js";
import type {
	BridgeEventName,
	LightsCity,
	LightsEventName,
	MoonEventName,
	SunEventName
} from "types";

import type { NavigationTabName, UserLang } from "@lib/types";

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

export interface SettingsContextType {
	readonly getSettings: Accessor<SettingsStore>;
	readonly resetSettings: () => void;
	readonly setSettings: Setter<SettingsStore>;
}
