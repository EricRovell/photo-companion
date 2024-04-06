import type { UserLang, NavigationTabName } from "@lib/types";
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
