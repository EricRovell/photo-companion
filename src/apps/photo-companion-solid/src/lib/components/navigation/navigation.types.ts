import type { IconProps } from "ui-solid";
import type { Component } from "solid-js";

export type NavigationTabName =
	| "TIMELINE"
	| "LIGHTS"
	| "SUN"
	| "MOON"
	| "BRIDGES";

export interface NavigationRoute {
	href: string;
	disabled?: boolean;
	Icon: Component<IconProps>;
	label: NavigationTabName;
}
