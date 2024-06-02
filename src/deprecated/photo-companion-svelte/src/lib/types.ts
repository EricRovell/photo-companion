import type { ComponentType } from "svelte";

export type EventGroupName =
	| "bridges-spb"
	| "lights"
	| "moon"
	| "sun";

export interface EventComponent<Props> {
	component: ComponentType;
	props: Props;
	message?: string;
	title: string;
	type?: "bridge" | "lights" | "moon" | "sun";
}

export type NavigationTabName =
	| "TIMELINE"
	| "LIGHTS"
	| "SUN"
	| "MOON"
	| "BRIDGES";

export type UserLang = "en" | "ru";
