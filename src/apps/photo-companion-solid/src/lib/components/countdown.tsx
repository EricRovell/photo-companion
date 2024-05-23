import { createSignal, createEffect } from "solid-js";
import { createTimeoutLoop } from "ui-solid/primitives";

import { Time } from "ui-solid";
import { useTranslation } from "@lib/context";

interface Props {
	initialTimestamp: number;
	callback?: () => number;
}

export function Countdown(props: Props) {
	const { formatters } = useTranslation();

	const [ time, setTime ] = createSignal(props.initialTimestamp - Date.now());
	const [ getDelay, setDelay ] = createSignal<number | false>(1000);
	const handleIncrement = () => setTime(value => value - 1000);

	createTimeoutLoop(handleIncrement, getDelay);

	createEffect(() => {
		if (time() <= 0) {
			if (!props.callback) {
				setDelay(false);
				return;
			}

			const timestamp = props.callback();
			setTime(timestamp - Date.now());
		}
	});

	return (
		<Time>
			{formatters().formatTimeDuration(time())}
		</Time>
	);
}
