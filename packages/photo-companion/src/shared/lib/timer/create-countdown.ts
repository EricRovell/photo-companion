import { type Accessor, createMemo } from "solid-js";
import { isNullable } from "utils/validators";

import { useClock } from "./clock";

interface Options {
	getTimestampCurrent?: Accessor<Nullable<number>>;
	getTimestampEnd: Accessor<number>;
	getTimestampStart?: Accessor<number>;
}

/**
 * Uses a live timestamp when supplied, otherwise advances from the selected start.
 * In standalone mode, changing the start resets the elapsed-time anchor.
 */
export function createCountdown(options: Options) {
	const { getTimestampCurrent, getTimestampEnd, getTimestampStart = Date.now } = options;

	const clock = useClock();

	const getAnchor = createMemo(() => ({
		startedAt: Date.now(),
		timestamp: getTimestampStart()
	}));

	return createMemo(() => {
		const current = getTimestampCurrent?.();

		if (!isNullable(current)) {
			return Math.max(0, getTimestampEnd() - current);
		}

		const anchor = getAnchor();
		const elapsed = Math.max(0, clock.getTimestamp() - anchor.startedAt);

		return Math.max(0, getTimestampEnd() - anchor.timestamp - elapsed);
	});
}
