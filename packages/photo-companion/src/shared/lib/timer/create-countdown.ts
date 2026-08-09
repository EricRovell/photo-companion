import { type Accessor, createEffect, createSignal, on } from "solid-js";
import { isNullable } from "utils/validators";

import { useDocumentVisibility } from "../../primitives/use-document-visibility";
import { createTimeoutLoop } from "./create-timeout-loop";

interface Options {
	getTimestampEnd: Accessor<number>;
	getTimestampStart?: Accessor<number>;
	step?: number;
}

const getCurrentTimestamp = () => Date.now();

/**
 * Creates a countdown timer between two timestamps.
 */
export function createCountdown({ getTimestampEnd, getTimestampStart = getCurrentTimestamp, step = 1000 }: Options) {
	const [ getTime, setTime ] = createSignal(0);
	const getVisibility = useDocumentVisibility();
	let previousDuration: Nullish<number> = null;
	let wasVisible = getVisibility();

	const handleIncrement = () => setTime(value => value - step);

	createTimeoutLoop(handleIncrement, step);

	/**
	 * Syncs countdown on Accessors' change
	 * and when page "wakens up".
	 */
	createEffect(() => {
		const duration = getTimestampEnd() - getTimestampStart();
		const visible = getVisibility();

		if (visible) {
			setTime(time => {
				if (isNullable(previousDuration) || !wasVisible) {
					return duration;
				}

				// calc difference
				return time + duration - previousDuration;
			});
		}

		previousDuration = duration;
		wasVisible = visible;
	});

	createEffect(on(getTime, time => {
		if (time < 0) {
			setTime(getTimestampEnd() - getTimestampStart());
		}
	}));

	return getTime;
}
