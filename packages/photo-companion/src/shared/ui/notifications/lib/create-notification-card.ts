import { NOTIFICATIONS_CONFIG } from "../consts";
import { createNotificationTimer } from "../model";
import { createNotificationIcon } from "./create-notification-icon";
import { createNotificationProgress } from "./create-notification-progress";

import type { CreateNotificationCardParams, NotificationCard, NotificationEntry, NotificationPointer } from "../types";

import styles from "../ui/notifications.module.css";

export const createNotificationCard = ({
	center,
	entry,
	onDragChange,
	viewportOptions
}: CreateNotificationCardParams): NotificationCard => {
	const element = document.createElement("li");
	const content = document.createElement("div");
	const progress = createNotificationProgress(element);

	const timer = createNotificationTimer({
		onChange: progress.update,
		onTimeout: () => center.dismiss(entry.id, "timeout")
	});

	let current = entry;
	let cleanup: (() => void) | undefined;
	let exitTimer: ReturnType<typeof setTimeout> | undefined;
	let pointer: NotificationPointer | undefined;
	let distance = 0;

	const renderContent = () => {
		cleanup?.();
		cleanup = undefined;

		content.replaceChildren();
		const variant = current.variant ?? "info";
		element.dataset.variant = variant;
		const icon = createNotificationIcon(variant, styles.icon);
		const body = document.createElement("div");
		body.className = styles.body;

		if (current.content) {
			const custom = current.content();
			body.append(custom.element);
			cleanup = custom.cleanup;
		} else {
			const title = document.createElement("p");
			title.className = styles.title;
			title.textContent = current.title;
			body.append(title);

			if (current.description) {
				const description = document.createElement("p");
				description.className = styles.description;
				description.textContent = current.description;
				body.append(description);
			}
		}

		if (current.action) {
			const action = current.action;
			const button = document.createElement("button");
			button.className = styles.action;
			button.type = "button";
			button.textContent = action.label;

			button.onclick = () => {
				action.onClick();

				if (action.dismiss !== false) {
					center.dismiss(current.id, "action");
				}
			};

			body.append(button);
		}

		const close = document.createElement("button");
		close.className = styles.close;
		close.type = "button";
		close.setAttribute("aria-label", `${viewportOptions.dismissLabel ?? "Dismiss"}: ${current.title}`);
		close.onclick = () => center.dismiss(current.id);

		content.append(icon, body, close);
	};

	const resetSwipe = () => {
		pointer = undefined;
		distance = 0;
		delete element.dataset.dragging;
		delete element.dataset.grabbing;

		element.style.setProperty("--notification-swipe", "0px");

		onDragChange({
			dragging: false,
			id: current.id
		});
	};

	const onPointerDown = (event: PointerEvent) => {
		if (event.button !== 0 || (event.target instanceof Element && event.target.closest("button, a, input, textarea, select"))) {
			return;
		}

		pointer = {
			id: event.pointerId,
			startedAt: performance.now(),
			x: event.clientX,
			y: event.clientY
		};

		element.dataset.grabbing = "true";
		element.setPointerCapture(event.pointerId);

		onDragChange({
			dragging: true,
			id: current.id
		});
	};

	const onPointerMove = (event: PointerEvent) => {
		if (event.pointerId !== pointer?.id) {
			return;
		}

		distance = event.clientX - pointer.x;

		if (!element.dataset.dragging && Math.abs(event.clientY - pointer.y) > Math.abs(distance)) {
			resetSwipe();

			return;
		}

		if (Math.abs(distance) > 8) {
			element.dataset.dragging = "true";
			element.style.setProperty("--notification-swipe", `${distance}px`);
		}
	};

	const onPointerUp = (event: PointerEvent) => {
		if (event.pointerId !== pointer?.id) {
			return;
		}

		const velocity = Math.abs(distance) / Math.max(1, performance.now() - pointer.startedAt);

		if (Math.abs(distance) > 80 || (Math.abs(distance) > 24 && velocity > 0.5)) {
			element.style.setProperty("--notification-exit-x", `${Math.sign(distance) * (element.offsetWidth || 400)}px`);
			center.dismiss(current.id);
		}

		resetSwipe();
	};

	const isLeaving = () => exitTimer !== undefined;

	const update = (next: NotificationEntry) => {
		clearTimeout(exitTimer);

		if (isLeaving()) {
			element.parentElement?.prepend(element);
			element.dataset.state = "open";
			exitTimer = undefined;
			element.style.removeProperty("--notification-exit-x");
		}

		current = next;

		const duration = current.duration ?? viewportOptions.duration ?? NOTIFICATIONS_CONFIG.defaultDuration;
		timer.reset(Number.isNaN(duration) ? NOTIFICATIONS_CONFIG.defaultDuration : duration);
		const hadFocus = element.contains(document.activeElement);
		const closing = document.activeElement?.classList.contains(styles.close);

		renderContent();

		if (hadFocus) {
			const buttons = element.querySelectorAll("button");

			return closing ? buttons[buttons.length - 1] : buttons[0];
		}
	};

	const leave = (onRemove: () => void) => {
		timer.pause();
		resetSwipe();

		element.inert = true;
		element.setAttribute("aria-hidden", "true");
		element.dataset.state = "leaving";

		exitTimer = setTimeout(onRemove, NOTIFICATIONS_CONFIG.exitDuration);
	};

	const init = () => {
		element.className = styles.item;
		element.dataset.id = entry.id;
		element.dataset.state = "entering";
		content.className = styles.content;
		element.prepend(content);

		element.onpointerdown = onPointerDown;
		element.onpointermove = onPointerMove;
		element.onpointerup = onPointerUp;
		element.onpointercancel = resetSwipe;
		element.onlostpointercapture = resetSwipe;
	};

	const dispose = () => {
		timer.pause();
		progress.dispose();
		clearTimeout(exitTimer);
		cleanup?.();
		cleanup = undefined;

		element.onpointerdown = null;
		element.onpointermove = null;
		element.onpointerup = null;
		element.onpointercancel = null;
		element.onlostpointercapture = null;
		element.remove();
	};

	init();

	return {
		content,
		dispose,
		element,
		get entry() { return current; },
		isLeaving,
		leave,
		pause: timer.pause,
		resume: timer.resume,
		update
	};
};
