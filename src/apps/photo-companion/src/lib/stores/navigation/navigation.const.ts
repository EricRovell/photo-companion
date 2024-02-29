import { iconTimeline, iconLights, iconSun, iconMoon, iconBridge } from "ui/icons";
import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
import type { NavigationRoute, NavigationTabName } from "./navigation.types";

export const NAVIGATION_TAB_ITEMS: Record<NavigationTabName, NavigationRoute> = {
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

export const DEFAULT_ORDER: NavigationTabName[] = [ "TIMELINE", "LIGHTS", "SUN", "MOON", "BRIDGES" ];
//const DEFAULT_INDEX = 0;
