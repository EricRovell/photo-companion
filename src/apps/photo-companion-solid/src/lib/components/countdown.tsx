import { createEffect, createSignal } from "solid-js";
import { Time } from "ui-solid";
import { createTimeoutLoop } from "ui-solid/primitives";

import { useTranslation } from "@lib/context";

interface Props {
	callback?: () => number;
	initialTimestamp: number;
}

export function Countdown(props: Props) {
	const { formatters } = useTranslation();

	const [ time, setTime ] = createSignal(props.initialTimestamp - Date.now());
	const [ getDelay, setDelay ] = createSignal<false | number>(1000);
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
