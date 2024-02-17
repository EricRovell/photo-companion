import { persistable } from "./helpers/persistable";
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
	"bridges-spb": "navigation" | "always" | null;
	"events-bridges-spb": BridgeEventName[] | null;
	"events-lights": LightsEventName[] | null;
	"events-moon": MoonEventName[] | null;
	"events-sun": SunEventName[] | null;
	"latitude": number;
	"lights-city"?: Nullable<LightsCity>;
	"longitude": number;
	"starting-page": string;
}

export const SETTINGS_DEFAULT: SettingsStore = Object.freeze({
	"bridges-spb": "navigation",
	"events-bridges-spb": [],
	"events-lights": [],
	"events-moon": [],
	"events-sun": [],
	"latitude": 59.844404,
	"lights-city": "SAINT_PETERSBURG",
	"longitude": 30.3131,
	"starting-page": "/timeline"
});

const SETTINGS_LOCAL_STORAGE_KEY = "settings";

export const settingsStore = persistable<SettingsStore>(
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_DEFAULT
);
