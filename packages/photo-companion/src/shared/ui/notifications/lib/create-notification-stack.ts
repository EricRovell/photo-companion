import { NOTIFICATIONS_CONFIG } from "../consts";

import type { CreateNotificationStackParams, NotificationCard, UpdateNotificationStackParams } from "../types";

import styles from "../ui/notifications.module.css";

export const createNotificationStack = ({ host, viewportOptions }: CreateNotificationStackParams) => {
	const position = viewportOptions.position ?? NOTIFICATIONS_CONFIG.defaultPosition;
	const direction = position.startsWith("bottom") ? -1 : 1;

	const visibleCount = Number.isFinite(viewportOptions.visibleCount ?? NOTIFICATIONS_CONFIG.defaultVisibleCount)
		? Math.max(1, Math.floor(viewportOptions.visibleCount ?? NOTIFICATIONS_CONFIG.defaultVisibleCount))
		: NOTIFICATIONS_CONFIG.defaultVisibleCount;

	const heights = new Map<NotificationCard, number>();

	let cards: readonly NotificationCard[] = [];
	let expanded = false;
	let observer: ResizeObserver | undefined;

	const region = document.createElement("section");
	const list = document.createElement("ol");
	const toggle = document.createElement("button");

	const layout = () => {
		const frontHeight = heights.get(cards[0]) ?? 0;
		let offset = 0;

		region.dataset.expanded = String(expanded);
		region.dataset.empty = String(cards.length === 0);

		toggle.hidden = cards.length < 2;
		toggle.setAttribute("aria-expanded", String(expanded));
		toggle.textContent = `${viewportOptions.stackLabel ?? "Notification stack"} (${cards.length})`;

		cards.forEach((card, index) => {
			const hidden = index >= visibleCount;
			const obscured = hidden || (!expanded && index > 0);
			const height = heights.get(card) ?? NOTIFICATIONS_CONFIG.defaultHeight;

			card.element.inert = obscured;
			card.element.setAttribute("aria-hidden", String(obscured));
			card.element.dataset.obscured = String(obscured);
			card.element.dataset.hidden = String(hidden);
			card.element.style.setProperty("--notification-offset", `${direction * (expanded ? offset : index * NOTIFICATIONS_CONFIG.stackOffset)}px`);
			card.element.style.setProperty("--notification-scale", String(expanded ? 1 : Math.max(0.8, 1 - index * 0.05)));
			card.element.style.setProperty("--notification-height", `${expanded ? height : frontHeight}px`);
			card.element.style.zIndex = String(cards.length - index);

			if (!hidden) {
				offset += height + NOTIFICATIONS_CONFIG.gap;
			}
		});

		list.style.height = `${expanded ? Math.max(0, offset - NOTIFICATIONS_CONFIG.gap) : frontHeight + Math.max(0, Math.min(cards.length, visibleCount) - 1) * NOTIFICATIONS_CONFIG.stackOffset}px`;
	};

	const measure = () => {
		const arriving: NotificationCard[] = [];
		for (const card of heights.keys()) {
			// Read layout dimensions while transforms are still animating.
			const contentHeight = card.content.offsetHeight;
			const height = contentHeight ? contentHeight + 2 : NOTIFICATIONS_CONFIG.defaultHeight;
			heights.set(card, height);

			if (card.element.dataset.state === "entering") {
				card.element.style.setProperty("--notification-height", `${height}px`);
				card.element.style.setProperty("--notification-offset", "0px");
				card.element.style.setProperty("--notification-scale", "1");
				arriving.push(card);
			}
		}
		if (arriving.length) {
			// Commit every entrance pose before moving any cards in the stack.
			list.getBoundingClientRect();

			for (const card of arriving) {
				card.element.dataset.state = "open";
			}
		}

		layout();
	};

	const add = (card: NotificationCard) => {
		heights.set(card, NOTIFICATIONS_CONFIG.defaultHeight);
		list.prepend(card.element);
		observer?.observe(card.content);
	};

	const remove = (card: NotificationCard) => {
		observer?.unobserve(card.content);
		heights.delete(card);
	};

	const setExpanded = (value: boolean) => {
		expanded = value;
		layout();
	};

	const update = ({ cards: next, expanded: isExpanded }: UpdateNotificationStackParams) => {
		cards = next;
		expanded = isExpanded;
		measure();
	};

	const init = () => {
		region.className = styles.viewport;
		region.dataset.contained = String(viewportOptions.contained ?? false);
		region.dataset.position = position;
		region.setAttribute("role", "region");
		region.setAttribute("aria-label", viewportOptions.label ?? "Notifications");
		list.className = styles.list;
		toggle.type = "button";
		toggle.className = styles.toggle;
		region.append(list, toggle);
		host.append(region);

		observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
	};

	const dispose = () => {
		observer?.disconnect();
		heights.clear();
		cards = [];
		region.remove();
	};

	init();

	return {
		add,
		dispose,
		elements: {
			list,
			region,
			toggle
		},
		remove,
		setExpanded,
		update,
		visibleCount
	};
};
