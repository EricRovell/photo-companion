import type { SetStoreFunction } from "solid-js/store";
import type {
	BridgeEventName,
	City,
	LightsEventName,
	MoonEventName,
	SunEventName
} from "types";

import type { ROUTE_PRIMARY_LABEL } from "@lib/consts/routes";
import type { UserLang } from "@lib/types";

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
	city: City;
	events_bridges_spb: Nullish<BridgeEventName[]>;
	events_lights: Nullish<LightsEventName[]>;
	events_moon: Nullish<MoonEventName[]>;
	events_sun: Nullish<SunEventName[]>;
	language: UserLang;
	latitude: number;
	longitude: number;
	tabs: ROUTE_PRIMARY_LABEL[];
}

export interface SettingsContextType {
	readonly resetSettings: () => void;
	readonly setSettings: SetStoreFunction<SettingsStore>;
	readonly settings: SettingsStore;
}

export interface CitySettingsPreset extends Pick<SettingsStore, "city" | "latitude" | "longitude"> {
	tabs: ROUTE_PRIMARY_LABEL[];
}
