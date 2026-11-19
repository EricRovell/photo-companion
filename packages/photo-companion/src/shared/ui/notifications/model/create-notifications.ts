import { isNullable } from "utils/validators";

import type { NotificationCenter, NotificationEntry, NotificationOptions } from "../types";

export function createNotifications(): NotificationCenter {
	let sequence = 0;
	let entries: readonly NotificationEntry[] = [];
	const listeners = new Set<(entries: readonly NotificationEntry[]) => void>();

	const emit = () => {
		for (const listener of listeners) {
			listener(entries);
		}
	};

	const show = (options: NotificationOptions) => {
		let id = options.id;

		while (isNullable(id)) {
			const candidate = `notification-${++sequence}`;

			if (!entries.some(item => item.id === candidate)) {
				id = candidate;
			}
		}

		const entry = {
			...options,
			id
		};

		entries = entries.some(item => item.id === id)
			? entries.map(item => item.id === id ? entry : item)
			: [ entry, ...entries ];

		emit();

		return id;
	};

	const clear = () => {
		const removed = entries;
		entries = [];

		emit();

		for (const entry of removed) {
			entry.onDismiss?.("dismiss");
		}
	};

	const dismiss: NotificationCenter["dismiss"] = (id, reason = "dismiss") => {
		const entry = entries.find(item => item.id === id);

		if (!entry) {
			return;
		}

		entries = entries.filter(item => item.id !== id);

		emit();

		entry.onDismiss?.(reason);
	};

	const subscribe: NotificationCenter["subscribe"] = listener => {
		listeners.add(listener);
		listener(entries);

		return () => { listeners.delete(listener); };
	};

	const update: NotificationCenter["update"] = (id, options) => {
		const entry = entries.find(item => item.id === id);

		if (entry) {
			show({
				...entry,
				...options,
				id
			});
		}
	};

	return {
		clear,
		dismiss,
		show,
		subscribe,
		update
	};
}
