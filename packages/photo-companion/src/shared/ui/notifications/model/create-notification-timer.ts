import { isNullable } from "utils/validators";

import type { CreateNotificationTimerParams } from "../types";

export const createNotificationTimer = ({ onChange, onTimeout }: CreateNotificationTimerParams) => {
	let duration = Infinity;
	let remaining = Infinity;
	let startedAt = 0;
	let timeout: null | ReturnType<typeof setTimeout> = null;

	const emit = () => onChange({
		duration,
		remaining,
		running: !isNullable(timeout)
	});

	const pause = () => {
		if (isNullable(timeout)) {
			return;
		}

		clearTimeout(timeout);
		timeout = null;
		remaining = Math.max(0, remaining - (performance.now() - startedAt));

		emit();
	};

	const reset = (value: number) => {
		pause();

		duration = Math.max(0, value);
		remaining = duration;

		emit();
	};

	const resume = () => {
		if (!isNullable(timeout) || !Number.isFinite(remaining)) {
			return;
		}

		startedAt = performance.now();

		timeout = setTimeout(() => {
			timeout = null;
			remaining = 0;
			emit();
			onTimeout();
		}, remaining);

		emit();
	};

	return {
		pause,
		reset,
		resume
	};
};
