import { createMemo, createSignal, Show, untrack } from "solid-js";

import { createTimeoutLoop } from "~/shared/lib/timer";

import { formatRiseSetCountdown } from "../../lib";

interface Props {
	date: Date;
	event: Nullish<Date>;
}

function CountdownTimer(props: { initialRemaining: number }) {
	const startedAt = Date.now();
	const initialRemaining = untrack(() => props.initialRemaining);
	const [ remaining, setRemaining ] = createSignal(initialRemaining);

	createTimeoutLoop(() => {
		setRemaining(Math.max(0, initialRemaining - (Date.now() - startedAt)));
	}, () => remaining() > 0 ? 1000 : false);

	return <>{formatRiseSetCountdown(remaining())}</>;
}

export function RiseSetCountdown(props: Props) {
	const countdown = createMemo(() => {
		const remaining = props.event ? props.event.getTime() - props.date.getTime() : NaN;
		return Number.isFinite(remaining) && remaining >= 0 ? { remaining } : null;
	});

	return (
		<Show when={countdown()} fallback="—" keyed>
			{countdown => <CountdownTimer initialRemaining={countdown.remaining} />}
		</Show>
	);
}
