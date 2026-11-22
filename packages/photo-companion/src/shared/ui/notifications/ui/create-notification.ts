import { createEffect, createUniqueId, onCleanup, untrack } from "solid-js";

import { isAccessor } from "~/shared/primitives";

import { notifications } from "../model";

import type { CreateNotificationParams, NotificationSource } from "../types";

/** Bind one notification to the current reactive scope, including disposal. */
export const createNotification = (source: NotificationSource, { center = notifications }: CreateNotificationParams = {}) => {
	const id = createUniqueId();
	const dismiss = () => center.dismiss(id);

	createEffect(() => {
		const value = isAccessor(source) ? source() : source;

		// Read object getters inside the effect so they can track reactive values too.
		return value ? {
			...value,
			id
		} : null;

	}, (options) => {
		if (options) {
			untrack(() => center.show(options));
		} else {
			untrack(dismiss);
		}
	});
	onCleanup(() => untrack(dismiss));

	return id;
};
