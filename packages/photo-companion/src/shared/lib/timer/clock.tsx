import { createContext, createEffect, createMemo, createSignal, untrack, useContext } from "solid-js";

import type { ParentProps } from "solid-js";

import { useDocumentVisibility } from "../../primitives/use-document-visibility";
import { createTimeoutLoop } from "./create-timeout-loop";

function createClock(throttleInterval = 15_000) {
	const initialTimestamp = Date.now();

	const [ getTick, setTick ] = createSignal({
		immediate: true,
		timestamp: initialTimestamp
	});

	const isVisible = useDocumentVisibility();

	const getTimestamp = createMemo(() => getTick().timestamp);

	const getThrottledTimestamp = createMemo<number>(previous => {
		const { immediate, timestamp } = getTick();

		return immediate || timestamp < previous || timestamp - previous >= throttleInterval
			? timestamp
			: previous;
	}, initialTimestamp);

	// Explicit updates and tab wake-up also update throttled consumers immediately.
	const setNow = () => setTick({
		immediate: true,
		timestamp: Date.now()
	});

	createEffect(() => {
		if (isVisible()) {
			setNow();

			createTimeoutLoop(() => setTick({
				immediate: false,
				timestamp: Date.now()
			}), 1000);
		}
	});

	return {
		getThrottledTimestamp,
		getTimestamp,
		isVisible,
		setNow
	};
}

const ClockContext = createContext<ReturnType<typeof createClock>>();

export function ClockProvider(props: ParentProps<{ throttleInterval?: number }>) {
	const clock = createClock(untrack(() => props.throttleInterval));

	return (
		<ClockContext.Provider value={clock}>
			{props.children}
		</ClockContext.Provider>
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
