import type { Accessor } from "solid-js";

import { createCountdown } from "~/shared/lib/timer";

import { useDatetime } from "./use-datetime";

/**
 * Count down using the app's one-second clock, including selected-date mode.
 */
export function useCountdown(getTimestampEnd: Accessor<Nullable<number>>) {
	const { getTimerTimestamp } = useDatetime();

	return createCountdown({
		getTimestampCurrent: getTimerTimestamp,
		getTimestampEnd: () => getTimestampEnd() ?? getTimerTimestamp()
	});
}
