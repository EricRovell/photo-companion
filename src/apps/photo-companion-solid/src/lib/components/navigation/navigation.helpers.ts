import { isNavigationTime } from "bridge-schedule";

import { useSettings } from "@lib/context";
import type { NavigationTabName } from "@lib/types";
import { NAVIGATION_TAB_DATA } from "./navigation.const";

export const useNavigationTabs = () => {
	const { getSettings } = useSettings();
	const { tabs, bridges_spb_navigation } = getSettings();

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
