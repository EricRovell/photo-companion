import { createSignal, untrack } from "solid-js";

import { createTimeoutLoop } from "~/shared/lib/timer";

import { formatCityLightsCountdown } from "../lib";

export function CityLightsCountdown(props: { duration: number }) {
	const initialDuration = untrack(() => props.duration);
	const startedAt = Date.now();
	const [ remaining, setRemaining ] = createSignal(initialDuration);

	const updateRemaining = () => {
		const elapsed = Date.now() - startedAt;
		setRemaining(Math.max(0, initialDuration - elapsed));
	};

	const getTickDelay = (): false | number => remaining() > 0 ? 1000 : false;

	createTimeoutLoop(updateRemaining, getTickDelay);

	return (
		<>
			{formatCityLightsCountdown(remaining())}
		</>
	);
}
