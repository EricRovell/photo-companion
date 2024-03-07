import { isNavigationTime } from "bridge-schedule";
import { type SettingsStore } from "@lib/stores/settings";

export function isBridgesTabHidden(value: SettingsStore["bridges_spb"]) {
	switch (value) {
		case "navigation": {
			return !isNavigationTime();
		}
		case "always": {
			return false;
		}
		default: {
			return true;
		}
	}
}
