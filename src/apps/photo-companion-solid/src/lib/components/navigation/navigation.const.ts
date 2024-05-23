import { iconTimeline, iconLights, iconSun, iconMoon, iconBridge } from "ui-solid/icons";

import { ROUTE } from "@lib/consts";
import type { NavigationRoute, NavigationTabName } from "./navigation.types";

export const NAVIGATION_TABS: NavigationTabName[] = [
	"TIMELINE",
	"LIGHTS",
	"SUN",
	"MOON",
	"BRIDGES"
];

export const NAVIGATION_TAB_DATA: Record<NavigationTabName, NavigationRoute> = {
	TIMELINE: {
		href: ROUTE.TIMELINE,
		icon: iconTimeline,
		label: "TIMELINE"
	},
	LIGHTS: {
		href: ROUTE.LIGHTS,
		icon: iconLights,
		label: "LIGHTS"
	},
	SUN: {
		href: ROUTE.SUN,
		icon: iconSun,
		label: "SUN"
	},
	MOON: {
		href: ROUTE.MOON,
		icon: iconMoon,
		label: "MOON"
	},
	BRIDGES: {
		href: ROUTE.BRIDGES,
		icon: iconBridge,
		label: "BRIDGES"
	}
};
