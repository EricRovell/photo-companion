export { homepage as URL_GITHUB_REPO } from "../../../package.json";
export const URL_COMMIT_HASH = "https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__";

export const ROUTE_ABOUT = "/about";
export const ROUTE_BRIDGES = "/bridges";
export const ROUTE_CHANGELOG = "/changelog";
export const ROUTE_LIGHTS = "/lights";
export const ROUTE_MOON = "/moon";
export const ROUTE_NOW = "/now";
export const ROUTE_ROOT = "/";
export const ROUTE_404 = "/404";
export const ROUTE_SETTINGS = "/settings";
export const ROUTE_SUN = "/sun";
export const ROUTE_TIMELINE = "/timeline";

export const ROUTE = {
	ABOUT: ROUTE_ABOUT,
	BRIDGES: ROUTE_BRIDGES,
	CHANGELOG: ROUTE_CHANGELOG,
	LIGHTS: ROUTE_LIGHTS,
	MOON: ROUTE_MOON,
	NOT_FOUND: ROUTE_404,
	NOW: ROUTE_NOW,
	ROOT: ROUTE_ROOT,
	SETTINGS: ROUTE_SETTINGS,
	SUN: ROUTE_SUN,
	TIMELINE: ROUTE_TIMELINE
} as const;

export type ROUTE_LABEL = Exclude<keyof typeof ROUTE, "NOT_FOUND" | "ROOT">;
export type ROUTE_VALUE = typeof ROUTE[keyof typeof ROUTE];

/**
 * Routes that define an app-feature section.
 */
export const ROUTES_PRIMARY: ROUTE_PRIMARY_LABEL[] = [
	"BRIDGES",
	"LIGHTS",
	"MOON",
	"NOW",
	"SUN",
	"TIMELINE"
] as const;

export type ROUTE_PRIMARY_LABEL = 
	| "BRIDGES"
	| "LIGHTS"
	| "MOON"
	| "NOW"
	| "SUN"
	| "TIMELINE";
