import { iconTimeline, iconLights, iconSun, iconMoon, iconBridge } from "ui/icons";
import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
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
		href: routeTimeline,
		icon: iconTimeline,
		label: "TIMELINE"
	},
	LIGHTS: {
		href: routeLights,
		icon: iconLights,
		label: "LIGHTS"
	},
	SUN: {
		href: routeSun,
		icon: iconSun,
		label: "SUN"
	},
	MOON: {
		href: routeMoon,
		icon: iconMoon,
		label: "MOON"
	},
	BRIDGES: {
		href: routeBridges,
		icon: iconBridge,
		label: "BRIDGES"
	}
};
