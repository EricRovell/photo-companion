import { isNavigationTime } from "bridge-schedule";

import { useSettings } from "@lib/context";

import { NAVIGATION_TAB_DATA } from "./navigation.const";

import type { NavigationTabName } from "@lib/types";

export const useNavigationTabs = () => {
	const { getSettings } = useSettings();
	const { bridges_spb_navigation, tabs } = getSettings();

	if (bridges_spb_navigation && !isNavigationTime()) {
		return tabs.filter(i => i !== "BRIDGES");
	}

	return tabs;
};

export function getTabData(tab: NavigationTabName) {
	return NAVIGATION_TAB_DATA[tab];
}

export function getTabUrl(tab: NavigationTabName) {
	return getTabData(tab).href;
}
