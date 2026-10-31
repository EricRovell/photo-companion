import type { ParentProps } from "solid-js";

import { ClockProvider } from "~/shared/lib/timer";

import { DATETIME_CONFIG } from "../config";
import { createDatetimeState, DatetimeContext } from "./use-datetime";

type Props = ParentProps<{ autoplayInterval?: number }>;

function DatetimeStateProvider(props: ParentProps) {
	const state = createDatetimeState();

	return (
		<DatetimeContext.Provider value={state}>
			{props.children}
		</DatetimeContext.Provider>
	);
}

export function DatetimeProvider(props: Props) {
	return (
		<ClockProvider
			throttleInterval={props.autoplayInterval ?? DATETIME_CONFIG.autoplayInterval}
		>
			<DatetimeStateProvider>
				{props.children}
			</DatetimeStateProvider>
		</ClockProvider>
	);
}
