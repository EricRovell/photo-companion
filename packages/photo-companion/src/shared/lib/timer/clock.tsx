import { createContext, untrack, useContext } from "solid-js";

import type { ParentProps } from "solid-js";

import { createClock } from "./create-clock";

const ClockContext = createContext<null | ReturnType<typeof createClock>>(null);

type ClockProviderProps = ParentProps<{
	/**
	 * Update the clock to the current time when flag becomes true.
	*/
	refreshWhen?: boolean;
	throttleInterval?: number;
}>;

export function ClockProvider(props: ClockProviderProps) {
	const clock = createClock(untrack(() => props.throttleInterval), () => props.refreshWhen);

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
