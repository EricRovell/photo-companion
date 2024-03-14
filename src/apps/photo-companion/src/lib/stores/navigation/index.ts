import { path } from "svelte-pathfinder";
import { writable, get } from "svelte/store";
import { isNullable } from "utils/validators";

import { settingsStore } from "@lib/stores/settings";
import { NAVIGATION_TAB_ITEMS, DEFAULT_ORDER } from "./navigation.const";
import { isBridgesTabHidden } from "./navigation.helpers";
import type { NavigationRoute, NavigationTabName } from "./navigation.types";

function getNavigationEntries(entries: NavigationTabName[] = DEFAULT_ORDER): NavigationRoute[] {
	const currentPath = `/${get(path)[0]}`;

	return entries.map(name => {
		const data = NAVIGATION_TAB_ITEMS[name];

		return {
			...data,
			current: data.href === currentPath
		};
	});
}

function createNavigationStore() {
	const { subscribe, set, update } = writable(getNavigationEntries());

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

	path.subscribe(value => {
		const currentPath = `/${value[0]}`;
		return update(values => values.map(item => {
			item.current = item.href === currentPath;
			return item;
		}));
	});

	return {
		subscribe,
		set
	};
}

export const navigationStore = createNavigationStore();
