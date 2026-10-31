import { useSearchParams } from "@solidjs/router";
import { createContext, createEffect, createMemo, useContext } from "solid-js";
import { isNonEmptyString, isNullable } from "utils/validators";

import { createQueryDate, parseQueryDate } from "~/shared/lib/query-date";
import { useClock } from "~/shared/lib/timer";

export function createDatetimeState() {
	const [ searchParams, setSearchParams ] = useSearchParams<{ datetime: string }>();
	const clock = useClock();
	const autoplayClock = useClock({ throttle: true });

	const isAutoplay = createMemo(() => isNullable(searchParams.datetime));

	const getSelection = createMemo(() => {
		const query = searchParams.datetime;

		return isNullable(query) ? null : {
			date: parseQueryDate(query),
			startedAt: Date.now()
		};
	});

	createEffect(() => {
		if (isAutoplay()) {
			clock.setNow();
		}
	});

	const getDatetimeQuery = createMemo(() => {
		if (isNullable(searchParams.datetime)) {
			return createQueryDate(autoplayClock.getTimestamp());
		}

		return searchParams.datetime;
	});

	const getDatetime = createMemo(() => getSelection()?.date ?? parseQueryDate(getDatetimeQuery()));
	const getTimestamp = createMemo(() => getDatetime().getTime());

	// Timers advance independently of the slower app date, including in selected-date mode.
	const getTimerTimestamp = createMemo(() => {
		const selection = getSelection();
		const now = clock.getTimestamp();

		return selection
			? selection.date.getTime() + Math.max(0, now - selection.startedAt)
			: now;
	});

	const getTimerDatetime = createMemo(() => new Date(getTimerTimestamp()));

	const setDatetimeQuery = (input?: DateLike | string): void => {
		if (isNullable(input)) {
			clock.setNow();
			setSearchParams({ datetime: null });

			return;
		}

		const datetime = isNonEmptyString(input)
			? createQueryDate(parseQueryDate(input))
			: createQueryDate(input);

		setSearchParams({ datetime });
	};

	return {
		getDatetime,
		getDatetimeQuery,
		getTimerDatetime,
		getTimerTimestamp,
		getTimestamp,
		isAutoplay,
		setDatetimeQuery
	};
}

export const DatetimeContext = createContext<ReturnType<typeof createDatetimeState>>();

export function useDatetime() {
	const state = useContext(DatetimeContext);

	if (isNullable(state)) {
		throw new Error("useDatetime must be used with a DatetimeProvider");
	}

	return state;
}
