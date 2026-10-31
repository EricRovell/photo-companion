import type { Accessor } from "solid-js";

import { createCountdown } from "~/shared/lib/timer";

import { formatCityLightsCountdown } from "../lib";

interface Props {
	duration: number;
	getTimerTimestamp?: Accessor<number>;
	timestamp: number;
}

export function CityLightsCountdown(props: Props) {
	const remaining = createCountdown({
		getTimestampCurrent: () => props.getTimerTimestamp?.(),
		getTimestampEnd: () => props.timestamp,
		getTimestampStart: () => props.timestamp - props.duration
	});

	return (
		<>
			{formatCityLightsCountdown(remaining())}
		</>
	);
}
