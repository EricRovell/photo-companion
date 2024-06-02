import {
	IconBridge,
	IconLights,
	IconMoon,
	IconSun,
	IconTimeline
} from "ui";

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
	BRIDGES: {
		href: ROUTE.BRIDGES,
		Icon: IconBridge,
		label: "BRIDGES"
	},
	LIGHTS: {
		href: ROUTE.LIGHTS,
		Icon: IconLights,
		label: "LIGHTS"
	},
	MOON: {
		href: ROUTE.MOON,
		Icon: IconMoon,
		label: "MOON"
	},
	SUN: {
		href: ROUTE.SUN,
		Icon: IconSun,
		label: "SUN"
	},
	TIMELINE: {
		href: ROUTE.TIMELINE,
		Icon: IconTimeline,
		label: "TIMELINE"
	}
};
