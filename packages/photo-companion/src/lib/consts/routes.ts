export { homepage as URL_GITHUB_REPO } from "../../../package.json";
export const URL_COMMIT_HASH = "https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__";

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
