import type { NotificationCenter, NotificationVariant, NotificationViewportOptions } from "../../types";

type NotificationDemoMode = "animation" | "custom" | "expanded" | "persistent" | "stack" | "timers";

export interface NotificationDemoProps {
	mode: NotificationDemoMode;
	position?: NotificationViewportOptions["position"];
}

export interface CreateNotificationDemoParams {
	getMode: () => NotificationDemoMode;
}

export interface SeedNotificationsParams {
	center: NotificationCenter;
	mode: NotificationDemoMode;
}

export interface NotificationVariantDemoProps {
	variant?: NotificationVariant;
}

export interface NotificationVariantExample {
	description: string;
	label: string;
	title: string;
}
