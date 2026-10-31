import { createMemo, Show } from "solid-js";

import type { Accessor } from "solid-js";

import { createCountdown } from "~/shared/lib/timer";

import { formatRiseSetCountdown } from "../../lib";

interface Props {
	date: Date;
	event: Nullish<Date>;
	getTimerTimestamp?: Accessor<number>;
}

export function RiseSetCountdown(props: Props) {
	const available = createMemo(() => {
		const remaining = props.event ? props.event.getTime() - props.date.getTime() : NaN;
		return Number.isFinite(remaining) && remaining >= 0;
	});

	const remaining = createCountdown({
		getTimestampCurrent: () => props.getTimerTimestamp?.(),
		getTimestampEnd: () => props.event?.getTime() ?? 0,
		getTimestampStart: () => props.date.getTime()
	});

	return (
		<Show when={available()} fallback="—">
			{formatRiseSetCountdown(remaining())}
		</Show>
	);
}
