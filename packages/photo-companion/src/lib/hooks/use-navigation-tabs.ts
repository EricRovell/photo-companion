import { createMemo } from "solid-js";

import { useSettings } from "@lib/context/settings";

import { NAVIGATION_TAB_DATA } from "../components/navigation/navigation.const";

export const useNavigationTabs = () => {
	const { settings } = useSettings();

	const getTabNames = createMemo(() => settings.tabs);

	const getTabLinks = createMemo(() => {
		return getTabNames().map(tabName => NAVIGATION_TAB_DATA[tabName]);
	});

	return {
		getTabLinks,
		getTabNames
	};
};
