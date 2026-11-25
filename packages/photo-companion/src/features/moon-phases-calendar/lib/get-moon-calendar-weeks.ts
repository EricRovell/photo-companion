import { findMoonPhaseEvents, getMoonIllumination } from "moon-sun-calc";
import { DAYS_IN_WEEK, getDayStart, getMonthWeeks, isSameDay, shiftDate } from "utils/date";
import { clamp } from "utils/math";

import type { MoonPhaseEvent, MoonPhaseName } from "moon-sun-calc";
import type { CalendarDate } from "utils/date";

import { END_TIMESTAMP, MIN_TIMESTAMP, MOON_CALENDAR_FIRST_WEEKDAY, MOON_CALENDAR_SAMPLE_HOUR, PHASE_VALUES } from "../consts";

import type { MoonCalendarDay, MoonCalendarPhase } from "../types";

function getIntermediatePhaseName(value: number): MoonPhaseName {
	if (value < PHASE_VALUES.FIRST_QUARTER) {
		return "WAXING_CRESCENT";
	}

	if (value < PHASE_VALUES.FULL_MOON) {
		return "WAXING_GIBBOUS";
	}

	if (value < PHASE_VALUES.THIRD_QUARTER) {
		return "WANING_GIBBOUS";
	}

	return "WANING_CRESCENT";
}

function getCalendarPhase(date: CalendarDate, eventsByDay: ReadonlyMap<number, MoonPhaseEvent>): MoonCalendarPhase | null {
	const noon = new Date(date.year, date.month, date.day, MOON_CALENDAR_SAMPLE_HOUR);
	const dayStart = getDayStart(noon);
	const event = eventsByDay.get(dayStart);
	const timestamp = event?.time.getTime() ?? clamp(noon.getTime(), MIN_TIMESTAMP, END_TIMESTAMP - 1);

	if (noon.getDate() !== date.day || !isSameDay(noon, timestamp)) {
		return null;
	}

	const { fraction, phaseValue } = getMoonIllumination(timestamp);
	const nextDayStart = shiftDate(dayStart, "day", 1).getTime();

	return {
		fraction,
		name: event?.phase ?? getIntermediatePhaseName(phaseValue),
		principal: Boolean(event),
		// The Moon page charts need ephemeris data through the following midnight.
		selectable: dayStart >= MIN_TIMESTAMP && nextDayStart < END_TIMESTAMP,
		timestamp,
		value: event ? PHASE_VALUES[event.phase] : phaseValue
	};
}

export function getMoonCalendarWeeks(monthStart: number): MoonCalendarDay[][] {
	const month = new Date(monthStart).getMonth();
	const weeks = getMonthWeeks(monthStart, MOON_CALENDAR_FIRST_WEEKDAY);
	const firstDay = weeks[0][0];
	const lastDay = weeks[weeks.length - 1][DAYS_IN_WEEK - 1];
	const events = findMoonPhaseEvents({
		end: Math.min(new Date(lastDay.year, lastDay.month, lastDay.day + 1).getTime(), END_TIMESTAMP),
		start: Math.max(new Date(firstDay.year, firstDay.month, firstDay.day).getTime(), MIN_TIMESTAMP)
	});

	const eventsByDay = new Map(events.map(event => [ getDayStart(event.time), event ]));

	return weeks.map(week => week.map(date => ({
		day: date.day,
		outsideMonth: date.month !== month,
		phase: getCalendarPhase(date, eventsByDay)
	})));
}
