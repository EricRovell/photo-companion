import type { Component } from "solid-js";

export type EventGroupName =
	| "bridges-spb"
	| "lights"
	| "moon"
	| "sun";

export interface EventComponent<Props> {
	component: Component<Props>;
	message?: string;
	props: Props;
	title: string;
	type?: "bridge" | "lights" | "moon" | "sun";
}

export type NavigationTabName =
	| "BRIDGES"
	| "LIGHTS"
	| "MOON"
	| "NOW"
	| "SUN"
	| "TIMELINE";

export type UserLang = "en" | "ru";
