import type { Component } from "solid-js";
import type { IconProps } from "ui";

export type NavigationTabName =
	| "BRIDGES"
	| "LIGHTS"
	| "MOON"
	| "SUN"
	| "TIMELINE";

export interface NavigationRoute {
	disabled?: boolean;
	href: string;
	Icon: Component<IconProps>;
	label: NavigationTabName;
}
