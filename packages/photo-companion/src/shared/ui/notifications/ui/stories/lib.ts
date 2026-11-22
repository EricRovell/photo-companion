import { NOTIFICATIONS_STORY_CONFIG } from "./consts";

import type { NotificationCenter } from "../../types";
import type { SeedNotificationsParams } from "./types";

const showPersistentNotification = (center: NotificationCenter) => {
	center.show({
		action: {
			label: "Update now",
			onClick: () => {
				center.show({
					title: "You are up to date",
					variant: "success"
				});
			}
		},
		description: "A fresh version is ready. Your saved locations will be kept.",
		duration: Infinity,
		id: "app-update",
		title: "An update is available",
		variant: "info"
	});
};

const showCustomNotification = (center: NotificationCenter) => {
	center.show({
		content: () => {
			const element = document.createElement("div");
			const heading = document.createElement("strong");
			heading.textContent = "Golden hour is approaching";
			const details = document.createElement("p");
			details.textContent = "18:42–19:16 · Bring your tripod";
			details.style.cssText = "margin: 6px 0 0; color: var(--color-text-secondary); font-size: 13px";
			element.append(heading, details);

			return {
				element
			};
		},
		duration: Infinity,
		title: "Golden hour is approaching",
		variant: "success"
	});
};

const showStackNotifications = (center: NotificationCenter, duration: number) => {
	center.show({
		description: "Try enabling compass access in your browser settings, then align your device again.",
		duration,
		id: "compass",
		title: "Compass access is blocked",
		variant: "error"
	});
	center.show({
		duration,
		title: "Location saved",
		variant: "success"
	});
	center.show({
		description: "The sun sets at 19:16. You have time to find your spot.",
		duration,
		title: "A good evening for a photo walk",
		variant: "info"
	});
};

export const seedNotifications = ({ center, mode }: SeedNotificationsParams) => {
	switch (mode) {
		case "animation": break;
		case "persistent":
			showPersistentNotification(center);
			break;
		case "custom":
			showCustomNotification(center);
			break;
		default:
			showStackNotifications(center, mode === "timers" ? NOTIFICATIONS_STORY_CONFIG.initialDuration : Infinity);
	}
};
