import type { ComponentType } from "svelte";

import { default as PageAbout } from "../pages/about/about.page.mdx";
import { default as PageBridges } from "../pages/bridges/bridges.page.svelte";
import { default as PageChangelog } from "../pages/changelog.page.mdx";
import { default as PageLights } from "../pages/lights/lights.page.svelte";
import { default as PageMoon } from "../pages/moon/moon.page.svelte";
import { default as PageSettings } from "../pages/settings/settings.page.svelte";
import { default as PageSun } from "../pages/sun/sun.page.svelte";
import { default as PageTimeline } from "../pages/timeline/timeline.page.svelte";

import {
	routeAbout,
	routeBridges,
	routeChangelog,
	routeLights,
	routeMoon,
	routeSettings,
	routeSun,
	routeTimeline
} from "@lib/routes";

export const ROUTES_MAP: Record<string, ComponentType> = {
	[routeAbout]: PageAbout,
	[routeBridges]: PageBridges,
	[routeChangelog]: PageChangelog,
	[routeLights]: PageLights,
	[routeMoon]: PageMoon,
	[routeSettings]: PageSettings,
	[routeSun]: PageSun,
	[routeTimeline]: PageTimeline
};

export const ROUTES_LAYOUT_MAP = {
	"WITH_DATE_URL": new Set([ routeTimeline, routeLights, routeMoon, routeSun ]),
	"ARTICLE": new Set([ routeAbout, routeChangelog ]),
	"NONE": new Set([ routeBridges, routeSettings ])
};
