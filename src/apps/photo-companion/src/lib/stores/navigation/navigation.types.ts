export type NavigationTabName =
	| "TIMELINE"
	| "LIGHTS"
	| "SUN"
	| "MOON"
	| "BRIDGES";

export interface NavigationRoute {
	current?: boolean;
	href: string;
	disabled?: boolean;
	icon: string;
	label: NavigationTabName;
}
