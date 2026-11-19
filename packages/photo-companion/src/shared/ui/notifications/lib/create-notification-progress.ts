import type { NotificationTimerState } from "../types";

import styles from "../ui/notifications.module.css";

export const createNotificationProgress = (host: HTMLElement) => {
	const element = document.createElement("div");
	let animation: Animation | undefined;
	let duration = Infinity;

	const update = (state: NotificationTimerState) => {
		element.hidden = !Number.isFinite(state.duration) || state.duration <= 0;

		if (element.hidden) {
			animation?.cancel();
			animation = undefined;
			return;
		}

		element.style.clipPath = `inset(0 ${100 * (1 - state.remaining / state.duration)}% 0 0)`;

		if (typeof element.animate !== "function") {
			return;
		}

		if (!animation || duration !== state.duration) {
			animation?.cancel();
			duration = state.duration;

			animation = element.animate([
				{ clipPath: "inset(0 0% 0 0)" },
				{ clipPath: "inset(0 100% 0 0)" }
			], {
				duration,
				easing: "linear",
				fill: "both"
			});
		}

		animation.pause();
		animation.currentTime = state.duration - state.remaining;

		if (state.running) {
			animation.play();
		}
	};

	const init = () => {
		element.className = styles.progress;
		element.setAttribute("aria-hidden", "true");
		element.hidden = true;
		host.append(element);
	};

	const dispose = () => {
		animation?.cancel();
		element.remove();
	};

	init();

	return {
		dispose,
		update
	};
};
