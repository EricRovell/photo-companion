import { createContext, createEffect, createMemo, createSignal, untrack, useContext } from "solid-js";

import type { ParentProps } from "solid-js";

import { useDocumentVisibility } from "../../primitives/use-document-visibility";

function createClock(throttleInterval = 15_000) {
	const initialTimestamp = Date.now();

	const [ getTick, setTick ] = createSignal({
		immediate: true,
		timestamp: initialTimestamp
	});

	const isVisible = useDocumentVisibility();

	const getTimestamp = createMemo(() => getTick().timestamp);

	const getThrottledTimestamp = createMemo<number>((previous = initialTimestamp) => {
		const { immediate, timestamp } = getTick();

		return immediate || timestamp < previous || timestamp - previous >= throttleInterval
			? timestamp
			: previous;
	});

	// Explicit updates and tab wake-up also update throttled consumers immediately.
	const setNow = () => setTick({
		immediate: true,
		timestamp: Date.now()
	});

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

const ClockContext = createContext<null | ReturnType<typeof createClock>>(null);

export function ClockProvider(props: ParentProps<{ throttleInterval?: number }>) {
	const clock = createClock(untrack(() => props.throttleInterval));

	return (
		<ClockContext value={clock}>
			{props.children}
		</ClockContext>
	);
}

/**
 * Select one-second ticks or the provider's throttled timestamp.
 */
export function useClock(options: { throttle?: boolean } = {}) {
	const clock = useContext(ClockContext) ?? createClock();

	return {
		getTimestamp: options.throttle ? clock.getThrottledTimestamp : clock.getTimestamp,
		isVisible: clock.isVisible,
		setNow: clock.setNow
	};
}
