export const TITLE = "Photo Companion";
export { version as VERSION } from "../../../package.json";

export const ROUTES = {
	ABOUT: "/about",
	BRIDGES: "/bridges",
	CHANGELOG: "https://github.com/EricRovell/photo-companion/tree/main/packages/photo-companion/CHANGELOG.md",
	HEIGHT_BY_SHADOW: "/height-by-shadow",
	LIGHTS: "/lights",
	MOON: "/moon",
	NOT_FOUND: "/404",
	NOW: "/now",
	ROOT: "/",
	SETTINGS: "/settings",
	SUN: "/sun",
	TIMELINE: "/timeline"
} as const;
