import type { Component } from "solid-js";

export type EventGroupName =
	| "bridges-spb"
	| "lights"
	| "moon"
	| "sun";

export interface EventComponent<Props> {
	component: Component<Props>;
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
