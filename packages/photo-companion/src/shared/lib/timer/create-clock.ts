import { createEffect, createMemo, createSignal } from "solid-js";

import type { Accessor } from "solid-js";

import { useDocumentVisibility } from "../../primitives/use-document-visibility";

export function createClock(throttleInterval = 15_000, refreshWhen?: Accessor<boolean | undefined>) {
	const readNow = () => ({
		immediate: true,
		timestamp: Date.now()
	});

	const [ getTick, setTick ] = createSignal<ReturnType<typeof readNow>>(previous => (
		refreshWhen?.() || previous === undefined ? readNow() : previous
	));

	const isVisible = useDocumentVisibility();

	const getTimestamp = createMemo(() => getTick().timestamp);

	const getThrottledTimestamp = createMemo<number>(previous => {
		const { immediate, timestamp } = getTick();

		return previous === undefined || immediate || timestamp < previous || timestamp - previous >= throttleInterval
			? timestamp
			: previous;
	});

	// Explicit updates and tab wake-up also update throttled consumers immediately.
	const setNow = () => setTick(readNow());

	createEffect(isVisible, (visible) => {
		if (visible) {
			setNow();

			const interval = setInterval(() => setTick({
				immediate: false,
				timestamp: Date.now()
			}), 1000);

			return () => clearInterval(interval);
		}
	});

	return {
		getThrottledTimestamp,
		getTimestamp,
		isVisible,
		setNow
	};
}
