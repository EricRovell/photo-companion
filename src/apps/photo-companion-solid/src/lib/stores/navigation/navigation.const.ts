import { iconTimeline, iconLights, iconSun, iconMoon, iconBridge } from "ui-solid/icons";
import { ROUTE_BRIDGES, ROUTE_LIGHTS, ROUTE_MOON, ROUTE_SUN, ROUTE_TIMELINE } from "@lib/routes";
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
		href: ROUTE_TIMELINE,
		icon: iconTimeline,
		label: "TIMELINE"
	},
	LIGHTS: {
		href: ROUTE_LIGHTS,
		icon: iconLights,
		label: "LIGHTS"
	},
	SUN: {
		href: ROUTE_SUN,
		icon: iconSun,
		label: "SUN"
	},
	MOON: {
		href: ROUTE_MOON,
		icon: iconMoon,
		label: "MOON"
	},
	BRIDGES: {
		href: ROUTE_BRIDGES,
		icon: iconBridge,
		label: "BRIDGES"
	}
};
