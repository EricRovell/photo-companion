import { createMemo } from "solid-js";

import { useSettings } from "@lib/context";

import { NAVIGATION_TAB_DATA } from "../components/navigation/navigation.const";

export const useNavigationTabs = () => {
	const { getSettings } = useSettings();

	const getTabNames = createMemo(() => getSettings().tabs);

	const getTabLinks = createMemo(() => {
		return getTabNames().map(tabName => NAVIGATION_TAB_DATA[tabName]);
	});

	return {
		getTabLinks,
		getTabNames
	};
};
