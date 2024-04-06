import { isNavigationTime } from "bridge-schedule";

import { settings } from "../settings";

export const navigation = () => {
	const { tabs, bridges_spb_navigation } = settings();

	if (bridges_spb_navigation && !isNavigationTime()) {
		return tabs.filter(i => i !== "BRIDGES");
	}

	return tabs;
};
