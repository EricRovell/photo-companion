import { useLocation } from "@solidjs/router";
import { isNullable } from "utils/validators";

import type { ParentProps } from "solid-js";

import { ClockProvider } from "~/shared/lib/timer";

import { DATETIME_CONFIG } from "../config";
import { createDatetimeState, DatetimeContext } from "./use-datetime";

type Props = ParentProps<{ autoplayInterval?: number }>;

function DatetimeStateProvider(props: ParentProps) {
	const state = createDatetimeState();

	return (
		<DatetimeContext value={state}>
			{props.children}
		</DatetimeContext>
	);
}

export function DatetimeProvider(props: Props) {
	const location = useLocation();

	return (
		<ClockProvider
			refreshWhen={isNullable(location.query.datetime)}
			throttleInterval={props.autoplayInterval ?? DATETIME_CONFIG.autoplayInterval}
		>
			<DatetimeStateProvider>
				{props.children}
			</DatetimeStateProvider>
		</ClockProvider>
	);
}
