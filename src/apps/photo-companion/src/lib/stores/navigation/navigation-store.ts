import { isNavigationTime } from "bridge-schedule";
import { writable } from "svelte/store";
import { isNullable } from "utils/validators";

import { settingsStore } from "@lib/stores/settings";
import type { NavigationTabName } from "./navigation.types";
import { NAVIGATION_TABS } from "./navigation.const";

function createNavigationStore() {
	const { subscribe, set, update } = writable<NavigationTabName[]>(NAVIGATION_TABS);

	settingsStore?.subscribe((settings) => {
		if (isNullable(settings)) {
			return;
		}

		set(settings.tabs);

		if (settings.bridges_spb_navigation && !isNavigationTime()) {
			update(value => value.filter(i => i !== "BRIDGES"));
		}
	});

	return {
		subscribe,
		set
	};
}

export const navigationStore = createNavigationStore();
