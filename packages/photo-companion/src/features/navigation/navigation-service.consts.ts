import type { Component } from "solid-js";

import { ROUTES } from "~/shared/consts";
import {
	IconBook,
	IconBridge,
	IconCube,
	IconLights,
	IconMoon,
	IconPullRequest,
	IconSettings,
	IconShadow,
	IconSun,
	IconTimeline
} from "~/shared/ui/icons";

import type { IconProps } from "~/shared/ui";

export interface NavigationRoute {
	disabled?: boolean;
	href: string;
	icon: Component<IconProps>;
	label: ROUTE_LABEL;
}

export type ROUTE_LABEL = Exclude<keyof typeof ROUTES, "NOT_FOUND" | "ROOT">;
export type ROUTE_VALUE = typeof ROUTES[Exclude<keyof typeof ROUTES, "CHANGELOG">];

/**
 * Routes that define an app-feature section.
 */
export const ROUTES_PRIMARY: ROUTE_PRIMARY_LABEL[] = [
	"BRIDGES",
	"LIGHTS",
	"MOON",
	"NOW",
	"SUN",
	"TIMELINE",
	"HEIGHT_BY_SHADOW"
] as const;

export type ROUTE_PRIMARY_LABEL =
	| "BRIDGES"
	| "HEIGHT_BY_SHADOW"
	| "LIGHTS"
	| "MOON"
	| "NOW"
	| "SUN"
	| "TIMELINE"

export const NAVIGATION_TAB_DATA: Record<ROUTE_LABEL, NavigationRoute> = {
	ABOUT: {
		href: ROUTES.ABOUT,
		icon: IconBook,
		label: "ABOUT"
	},
	BRIDGES: {
		href: ROUTES.BRIDGES,
		icon: IconBridge,
		label: "BRIDGES"
	},
	CHANGELOG: {
		href: ROUTES.CHANGELOG,
		icon: IconPullRequest,
		label: "CHANGELOG"
	},
	HEIGHT_BY_SHADOW: {
		href: ROUTES.HEIGHT_BY_SHADOW,
		icon: IconShadow,
		label: "HEIGHT_BY_SHADOW"
	},
	LIGHTS: {
		href: ROUTES.LIGHTS,
		icon: IconLights,
		label: "LIGHTS"
	},
	MOON: {
		href: ROUTES.MOON,
		icon: IconMoon,
		label: "MOON"
	},
	NOW: {
		href: ROUTES.NOW,
		icon: IconCube,
		label: "NOW"
	},
	SETTINGS: {
		href: ROUTES.SETTINGS,
		icon: IconSettings,
		label: "SETTINGS"
	},
	SUN: {
		href: ROUTES.SUN,
		icon: IconSun,
		label: "SUN"
	},
	TIMELINE: {
		href: ROUTES.TIMELINE,
		icon: IconTimeline,
		label: "TIMELINE"
	}
};
