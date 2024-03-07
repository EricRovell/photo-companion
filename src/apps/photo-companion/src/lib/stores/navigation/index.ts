import { writable } from "svelte/store";
import { isNullable } from "@shared/utils";
import { settingsStore } from "@lib/stores/settings";
import { NAVIGATION_TAB_ITEMS, DEFAULT_ORDER } from "./navigation.const";
import { isBridgesTabHidden } from "./navigation.helpers";
import type { NavigationRoute, NavigationTabName } from "./navigation.types";

function getNavigationEntries(entries: NavigationTabName[] = DEFAULT_ORDER): NavigationRoute[] {
	return entries.map(name => NAVIGATION_TAB_ITEMS[name]);
}

function createNavigationStore() {
	const { subscribe, set } = writable(getNavigationEntries());

	settingsStore?.subscribe((value) => {
		if (isNullable(value)) {
			return;
		}

		const { lights_city, bridges_spb } = value;

		const updated = getNavigationEntries().filter(item => {
			if (item.label === "LIGHTS" && !lights_city) {
				return false;
			}

			if (item.label === "BRIDGES" && isBridgesTabHidden(bridges_spb)) {
				return false;
			}

			return true;
		});

		set(updated);
	});

	return {
		subscribe,
		set
	};
}

export const navigationStore = createNavigationStore();
