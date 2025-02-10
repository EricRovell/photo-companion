import { useLocation, useNavigate } from "@solidjs/router";
import { createMemo } from "solid-js";

import { ROUTES } from "~/lib/consts";
import { useSettings } from "~/lib/context/settings";
import { useSupportsBridges, useSupportsLights } from "~/lib/hooks";

import { NAVIGATION_TAB_DATA } from "./navigation-service.consts";

export function createNavigationService() {
	const { settings } = useSettings();

	const getTabNames = createMemo(() => settings.tabs);
	const supportsBridges = useSupportsBridges();
	const supportsLights = useSupportsLights();

	const navigateHome = () => {
		const navigate = useNavigate();
		const location = useLocation();
		const tab = settings.tabs[0] ?? "NOW";
		const route = `/${tab.toLowerCase()}${location.search}`;

		navigate(route, { replace: true });
	};

	const getNavigationTabs = createMemo(() => getTabNames().map(tabName => NAVIGATION_TAB_DATA[tabName]));

	const getNavigationMenuItems = () => ([
		[
			NAVIGATION_TAB_DATA.NOW,
			NAVIGATION_TAB_DATA.TIMELINE,
			...(supportsLights() ? [ NAVIGATION_TAB_DATA.LIGHTS ] : []),
			NAVIGATION_TAB_DATA.SUN,
			NAVIGATION_TAB_DATA.MOON,
			...(supportsBridges() ? [ NAVIGATION_TAB_DATA.BRIDGES ] : []),
			NAVIGATION_TAB_DATA.HEIGHT_BY_SHADOW
		],
		[
			NAVIGATION_TAB_DATA.SETTINGS,
			NAVIGATION_TAB_DATA.ABOUT,
			NAVIGATION_TAB_DATA.CHANGELOG
		]
	]);

	const createSwiper = () => {
		const navigate = useNavigate();
		const location = useLocation();
		const pathname = createMemo(() => location.pathname);

		const index = createMemo(() => getNavigationTabs().findIndex(tab => tab.href === pathname()));

		const swiper = (step: -1 | 1 = 1) => {
			let nextIndex = index() + step;

			if (nextIndex < 0) {
				nextIndex = getNavigationTabs().length - 1;
			} else if (nextIndex > getNavigationTabs().length - 1) {
				nextIndex = 0;
			}

			navigate(getNavigationTabs()[nextIndex].href);
		};

		return swiper;
	};

	return {
		createSwiper,
		getNavigationMenuItems,
		getNavigationTabs,
		navigateHome,
		NAVIGATION_TAB_DATA,
		ROUTES
	};
}
