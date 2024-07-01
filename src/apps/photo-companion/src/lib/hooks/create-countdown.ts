import { type Accessor, createEffect, createSignal, on } from "solid-js";
import { createTimeoutLoop, useDocumentVisibility } from "ui/primitives";

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

	const handleIncrement = () => setTime(value => value - step);

	createTimeoutLoop(handleIncrement, step);

	/**
	 * Syncs countdown on Accessors' change
	 * and when page "wakens up".
	 */
	createEffect(() => {
		if (getVisibility()) {
			setTime(getTimestampEnd() - getTimestampStart());
		}
	});

	createEffect(on(getTime, time => {
		if (time < 0) {
			setTime(getTimestampEnd() - getTimestampStart());
		}
	}));

	return getTime;
}
