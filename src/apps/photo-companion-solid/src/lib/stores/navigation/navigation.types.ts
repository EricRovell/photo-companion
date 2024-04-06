export type NavigationTabName =
	| "TIMELINE"
	| "LIGHTS"
	| "SUN"
	| "MOON"
	| "BRIDGES";

export interface NavigationRoute {
	href: string;
	disabled?: boolean;
	icon: string;
	label: NavigationTabName;
}
