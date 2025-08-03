import { createEffect, createSignal } from "solid-js";

import { useTranslation } from "~/features/translation";
import { createTimeoutLoop } from "~/shared/lib/timer";
import { Time } from "~/shared/ui";

interface Props {
	callback?: () => number;
	initialTimestamp: number;
}

export function Countdown(props: Props) {
	const { format } = useTranslation();

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
			{format().timeDuration(time())}
		</Time>
	);
}
