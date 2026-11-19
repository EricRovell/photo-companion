import type { NotificationVariant } from "../../types";
import type { NotificationVariantExample } from "./types";

export const NOTIFICATIONS_STORY_CONFIG = {
	addDuration: 5000,
	burstDelays: [ 180, 360 ],
	defaultVariants: [ "neutral", "info", "success", "warning", "error" ] satisfies NotificationVariant[],
	initialDuration: 8000,
	stageStyle: {
		"background": "var(--color-surface-0)",
		"border": "var(--border)",
		"border-radius": "var(--card-radius)",
		"min-height": "620px",
		"overflow": "hidden",
		"padding": "24px",
		"position": "relative",
		"width": "100%"
	},
	variants: {
		error: {
			description: "Check your connection and try saving this location again.",
			label: "Error",
			title: "Location could not be saved"
		},
		info: {
			description: "The sun sets at 19:16. You have time to find your spot.",
			label: "Info",
			title: "Golden hour is approaching"
		},
		neutral: {
			description: "Your route and saved locations are ready for this evening.",
			label: "Neutral",
			title: "Photo walk reminder"
		},
		success: {
			description: "You can find this spot in your saved locations.",
			label: "Success",
			title: "Location saved"
		},
		warning: {
			description: "Move to an open area for a more precise location before aligning your camera.",
			label: "Warning",
			title: "Location accuracy is low"
		}
	} satisfies Record<NotificationVariant, NotificationVariantExample>
} as const;
