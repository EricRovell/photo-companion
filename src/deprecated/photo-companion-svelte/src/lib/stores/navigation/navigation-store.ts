import { isNavigationTime } from "bridge-schedule";
import { writable } from "svelte/store";
import { isNullable } from "utils/validators";

import { settingsStore } from "@lib/stores/settings";
import { NAVIGATION_TABS } from "./navigation.const";
import type { NavigationTabName } from "@lib/types";

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
