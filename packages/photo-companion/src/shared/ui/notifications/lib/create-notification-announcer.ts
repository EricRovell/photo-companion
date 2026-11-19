import type { NotificationEntry } from "../types";

import styles from "../ui/notifications.module.css";

const createLiveRegion = (role: "alert" | "status") => {
	const element = document.createElement("div");
	element.className = styles.announcer;
	element.setAttribute("role", role);
	element.setAttribute("aria-atomic", "true");

	return element;
};

const formatAnnouncements = (entries: NotificationEntry[]) => entries
	.map(entry => [ entry.title, entry.description ].filter(Boolean).join(". "))
	.join(". ");

export const createNotificationAnnouncer = (region: HTMLElement) => {
	const polite = createLiveRegion("status");
	const urgent = createLiveRegion("alert");
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let entries: NotificationEntry[] = [];
	region.prepend(polite, urgent);

	const announce = (entry: NotificationEntry) => {
		entries.push(entry);
		polite.textContent = "";
		urgent.textContent = "";
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			polite.textContent = formatAnnouncements(entries.filter(item => item.variant !== "error"));
			urgent.textContent = formatAnnouncements(entries.filter(item => item.variant === "error"));
			entries = [];
		}, 0);
	};

	const dispose = () => {
		clearTimeout(timeout);
		entries = [];
		polite.remove();
		urgent.remove();
	};

	return {
		announce,
		dispose
	};
};
