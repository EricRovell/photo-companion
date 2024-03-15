import { NAVIGATION_TAB_DATA } from "./navigation.const";
import type { NavigationTabName } from "@lib/types";

export function getTabData(tab: NavigationTabName) {
	return NAVIGATION_TAB_DATA[tab];
}

export function getTabUrl(tab: NavigationTabName) {
	return getTabData(tab).href;
}
