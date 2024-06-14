import {
	IconBook,
	IconBridge,
	IconLights,
	IconMoon,
	IconPullRequest,
	IconSettings,
	IconSun,
	IconTimeline
} from "ui";

import { ROUTE } from "@lib/consts";

import type { NavigationRoute } from "./navigation.types";
import type { ROUTE_LABEL } from "@lib/consts/routes";

export const NAVIGATION_TAB_DATA: Record<ROUTE_LABEL, NavigationRoute> = {
	ABOUT: {
		href: ROUTE.ABOUT,
		icon: IconBook,
		label: "ABOUT"
	},
	BRIDGES: {
		href: ROUTE.BRIDGES,
		icon: IconBridge,
		label: "BRIDGES"
	},
	CHANGELOG: {
		href: ROUTE.CHANGELOG,
		icon: IconPullRequest,
		label: "CHANGELOG"
	},
	LIGHTS: {
		href: ROUTE.LIGHTS,
		icon: IconLights,
		label: "LIGHTS"
	},
	MOON: {
		href: ROUTE.MOON,
		icon: IconMoon,
		label: "MOON"
	},
	SETTINGS: {
		href: ROUTE.SETTINGS,
		icon: IconSettings,
		label: "SETTINGS"
	},
	SUN: {
		href: ROUTE.SUN,
		icon: IconSun,
		label: "SUN"
	},
	TIMELINE: {
		href: ROUTE.TIMELINE,
		icon: IconTimeline,
		label: "TIMELINE"
	}
};
