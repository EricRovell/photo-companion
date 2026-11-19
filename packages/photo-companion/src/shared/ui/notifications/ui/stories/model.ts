import { onCleanup, untrack } from "solid-js";

import { createNotifications } from "../../model";
import { NOTIFICATIONS_STORY_CONFIG } from "./consts";
import { seedNotifications } from "./lib";

import type { CreateNotificationDemoParams } from "./types";

export const createNotificationDemo = ({ getMode }: CreateNotificationDemoParams) => {
	const center = createNotifications();
	const burstTimers = new Set<ReturnType<typeof setTimeout>>();
	let count = 0;

	const clear = () => {
		for (const timer of burstTimers) {
			clearTimeout(timer);
		}

		burstTimers.clear();
		center.clear();
	};

	const add = () => {
		count += 1;

		center.show({
			description: count % 2 ? "Your location is ready for the next calculation." : undefined,
			duration: getMode() === "timers" ? NOTIFICATIONS_STORY_CONFIG.addDuration : Infinity,
			title: `Notification ${count}`,
			variant: count % 3 === 0 ? "error" : count % 2 === 0 ? "success" : "info"
		});
	};

	const addThree = () => {
		add();

		for (const delay of NOTIFICATIONS_STORY_CONFIG.burstDelays) {
			const timer = setTimeout(() => {
				burstTimers.delete(timer);
				add();
			}, delay);

			burstTimers.add(timer);
		}
	};

	const reset = () => {
		clear();

		seedNotifications({
			center,
			mode: getMode()
		});
	};

	const init = () => {
		onCleanup(clear);
		untrack(reset);
	};

	init();

	return {
		add,
		addThree,
		center,
		clear,
		reset
	};
};
