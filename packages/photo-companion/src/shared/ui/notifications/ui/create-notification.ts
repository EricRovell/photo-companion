import { createEffect, createUniqueId, onCleanup, untrack } from "solid-js";

import { isAccessor } from "~/shared/primitives";

import { notifications } from "../model";

import type { CreateNotificationParams, NotificationSource } from "../types";

/** Bind one notification to the current reactive scope, including disposal. */
export const createNotification = (source: NotificationSource, { center = notifications }: CreateNotificationParams = {}) => {
	const id = createUniqueId();
	const dismiss = () => center.dismiss(id);

	const sync = () => {
		const value = isAccessor(source) ? source() : source;

		// Read object getters inside the effect so they can track reactive values too.
		const options = value ? {
			...value,
			id
		} : null;

		untrack(() => {
			if (options) {
				center.show(options);
			} else {
				dismiss();
			}
		});
	};

	const init = () => {
		createEffect(sync);
		onCleanup(() => untrack(dismiss));
	};

	init();

	return id;
};
