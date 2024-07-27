import { type Accessor, createEffect, createSignal, onCleanup, untrack } from "solid-js";
import { isServer } from "solid-js/web";

type Timer =
	| typeof setInterval
	| typeof setTimeout;

type TimeoutSource =
	| Accessor<false | number>
	| number;

/**
 * Create a timer ({@link setTimeout} or {@link setInterval})
 * which automatically clears when the reactive scope is disposed.
 *
 * @param fn Function to be called every {@link delay}.
 * @param delay Number representing the time between executions of {@link fn} in ms.
 * @param timer The timer to create: {@link setTimeout} or {@link setInterval}.
 * @returns Function to manually clear the interval.
 */
export function makeTimer(fn: VoidFn, delay: number, timer: Timer): VoidFn {
	if (isServer) {
		return () => void 0;
	}

	const timerID = timer(fn, delay);
	const clear = () => clearInterval(timerID);

	return onCleanup(clear);
}

/**
 * Like an interval from {@link createTimer}
 * except the timeout only updates between executions.
 *
 * @param handler Function to be called every {@link timeout}
 * @param timeout Number or Function returning a number representing the time
 * between executions of {@link handler} in ms, or false to disable looping.
 */
export function createTimeoutLoop(fn: VoidFn, timeout: TimeoutSource): void {
	if (isServer) {
		return void 0;
	}

	if (typeof timeout === "number") {
		makeTimer(fn, timeout, setInterval);
		return;
	}

	const [ currentTimeout, setCurrentTimeout ] = createSignal(untrack(timeout));

	createEffect(() => {
		const current = currentTimeout();

		if (current === false) {
			return;
		}

		makeTimer(() => {
			fn();
			setCurrentTimeout(timeout);
		}, current, setInterval);
	});
}
