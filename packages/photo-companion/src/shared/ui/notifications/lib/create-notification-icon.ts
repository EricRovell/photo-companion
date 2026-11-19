import { ICON_PATHS } from "../consts";

import type { NotificationVariant } from "../types";

export const createNotificationIcon = (variant: NotificationVariant, className: string) => {
	const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	icon.setAttribute("class", className);
	icon.setAttribute("viewBox", "0 0 24 24");
	icon.setAttribute("fill", "none");
	icon.setAttribute("stroke", "currentColor");
	icon.setAttribute("stroke-width", "1.75");
	icon.setAttribute("stroke-linecap", "round");
	icon.setAttribute("stroke-linejoin", "round");
	icon.setAttribute("aria-hidden", "true");
	icon.setAttribute("focusable", "false");

	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", ICON_PATHS[variant]);
	icon.append(path);

	return icon;
};
