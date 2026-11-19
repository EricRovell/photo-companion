import { createNotificationAnnouncer } from "./create-notification-announcer";
import { createNotificationCard } from "./create-notification-card";
import { createNotificationInteractions } from "./create-notification-interactions";
import { createNotificationStack } from "./create-notification-stack";

import type { MountNotificationsParams, NotificationCard, NotificationCenter, NotificationEntry } from "../types";

const mountedCenters = new WeakSet<NotificationCenter>();

/** Connects the notification center to a viewport and returns its disposer. */
export function mountNotifications({
	center,
	host,
	viewportOptions = {}
}: MountNotificationsParams) {
	if (mountedCenters.has(center)) {
		throw new Error("A notification channel can only have one mounted viewport.");
	}

	const options = { ...viewportOptions };
	const cards = new Map<string, NotificationCard>();
	const stack = createNotificationStack({
		host,
		viewportOptions: options
	});

	const announcer = createNotificationAnnouncer(stack.elements.region);
	let entries: readonly NotificationEntry[] = [];
	let disposed = false;

	const syncTimers = () => {
		const activeCount = interactions.expanded() ? stack.visibleCount : 1;
		const paused = interactions.paused();

		entries.forEach((entry, index) => {
			const card = cards.get(entry.id);
			if (paused || index >= activeCount) {
				card?.pause();
			} else {
				card?.resume();
			}
		});
	};

	const interactions = createNotificationInteractions({
		center,
		elements: stack.elements,
		expanded: options.expanded,
		onChange: () => {
			stack.setExpanded(interactions.expanded());
			syncTimers();
		},
		onPauseChange: syncTimers
	});

	const removeCard = (card: NotificationCard) => {
		stack.remove(card);
		card.dispose();
		cards.delete(card.entry.id);
	};

	const syncEntries = (next: readonly NotificationEntry[]) => {
		entries = next;
		const activeCards: NotificationCard[] = [];
		const activeElement = document.activeElement;
		let moveFocus = !next.length && stack.elements.region.contains(activeElement)
			|| next.length < 2 && activeElement === stack.elements.toggle;
		let updatedFocus: HTMLButtonElement | undefined;

		for (const [ id, card ] of cards) {
			if (next.some(entry => entry.id === id) || card.isLeaving()) {
				continue;
			}

			moveFocus ||= card.element.contains(activeElement);
			card.leave(() => removeCard(card));
		}

		for (const [ index, entry ] of next.entries()) {
			let card = cards.get(entry.id);
			const changed = card?.entry !== entry;

			if (!card) {
				card = createNotificationCard({
					center,
					entry,
					onDragChange: interactions.setDragging,
					viewportOptions: options
				});

				cards.set(entry.id, card);
				stack.add(card);
			}

			activeCards.push(card);
			moveFocus ||= index >= stack.visibleCount && card.element.contains(activeElement);

			if (changed) {
				updatedFocus = card.update(entry) ?? updatedFocus;
				announcer.announce(entry);
			}
		}

		if (!next.length) {
			interactions.reset();
		} else if (next.length === 1) {
			interactions.unpin();
		}

		stack.update({
			cards: activeCards,
			expanded: interactions.expanded()
		});

		syncTimers();

		if (moveFocus) {
			const remaining = activeCards.map(card => card.element.querySelector("button")).find(button => button !== null);
			interactions.restoreFocus(remaining);
		} else if (updatedFocus) {
			interactions.restoreFocus(updatedFocus);
		}
	};

	const init = () => {
		mountedCenters.add(center);
		return center.subscribe(syncEntries);
	};

	const dispose = () => {
		if (disposed) {
			return;
		}

		disposed = true;
		unsubscribe();
		interactions.dispose();
		announcer.dispose();

		for (const card of cards.values()) {
			removeCard(card);
		}

		stack.dispose();
		mountedCenters.delete(center);
	};

	const unsubscribe = init();

	return dispose;
}
