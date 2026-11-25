import { createMemo, createSignal } from "solid-js";
import { getDayStart, getMonthStart, shiftDate } from "utils/date";
import { clamp } from "utils/math";

import { useDatetime } from "~/features/datetime-query";

import { FIRST_CALENDAR_MONTH, LAST_CALENDAR_MONTH } from "./consts";
import { getMoonCalendarWeeks } from "./lib";

export function createMoonCalendar() {
	const { getDisplayedDatetime } = useDatetime();
	const selectedDay = createMemo(() => getDayStart(getDisplayedDatetime()));

	const [ month, setMonth ] = createSignal(() => (
		clamp(getMonthStart(selectedDay()), FIRST_CALENDAR_MONTH, LAST_CALENDAR_MONTH)
	));

	const weeks = createMemo(() => getMoonCalendarWeeks(month()));

	const navigate = (amount: number) => {
		const target = getMonthStart(shiftDate(month(), "month", amount));
		setMonth(clamp(target, FIRST_CALENDAR_MONTH, LAST_CALENDAR_MONTH));
	};

	return {
		canGoBack: () => month() > FIRST_CALENDAR_MONTH,
		canGoNext: () => month() < LAST_CALENDAR_MONTH,
		month,
		navigate,
		selectedDay,
		weeks
	};
}
