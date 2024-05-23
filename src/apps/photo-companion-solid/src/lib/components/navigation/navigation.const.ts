import {
	IconTimeline,
	IconLights,
	IconSun,
	IconMoon,
	IconBridge
} from "ui-solid";

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
		Icon: IconTimeline,
		label: "TIMELINE"
	},
	LIGHTS: {
		href: ROUTE.LIGHTS,
		Icon: IconLights,
		label: "LIGHTS"
	},
	SUN: {
		href: ROUTE.SUN,
		Icon: IconSun,
		label: "SUN"
	},
	MOON: {
		href: ROUTE.MOON,
		Icon: IconMoon,
		label: "MOON"
	},
	BRIDGES: {
		href: ROUTE.BRIDGES,
		Icon: IconBridge,
		label: "BRIDGES"
	}
};
