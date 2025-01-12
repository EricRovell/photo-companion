import type { Component } from "solid-js";
import type { IconProps } from "ui";

import type { ROUTE_LABEL } from "@lib/consts/routes";

export interface NavigationRoute {
	disabled?: boolean;
	href: string;
	icon: Component<IconProps>;
	label: ROUTE_LABEL;
}
