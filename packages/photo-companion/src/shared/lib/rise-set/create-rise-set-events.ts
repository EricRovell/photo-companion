import { MAX_SUPPORTED_YEAR, MIN_SUPPORTED_YEAR } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { getDayStart, isSameDay, shiftDate } from "utils/date";

import type { Observer, RiseSetInterval, RiseSetSearchInput } from "moon-sun-calc";
import type { Accessor } from "solid-js";

import { selectRiseSetInterval } from "./select-rise-set-interval";

interface Options {
	date: Accessor<Date>;
	findIntervals: (input: RiseSetSearchInput) => RiseSetInterval[];
	observer: Accessor<Observer>;
}

const MIN_TIMESTAMP = Date.UTC(MIN_SUPPORTED_YEAR, 0, 1);
const MAX_TIMESTAMP = Date.UTC(MAX_SUPPORTED_YEAR + 1, 0, 1) - 1;

export function createRiseSetEvents(options: Options) {
	const dayStart = createMemo(() => getDayStart(options.date()));

	const intervals = createMemo(() => options.findIntervals({
		interval: {
			end: Math.min(shiftDate(dayStart(), "day", 2).getTime(), MAX_TIMESTAMP),
			start: Math.max(shiftDate(dayStart(), "day", -1).getTime(), MIN_TIMESTAMP)
		},
		observer: options.observer()
	}));

	const rise = () => intervals().find(({ rise }) => rise && isSameDay(rise, dayStart()))?.rise ?? null;
	const set = () => intervals().find(({ set }) => set && isSameDay(set, dayStart()))?.set ?? null;
	const riseSetTimes = createMemo(() => selectRiseSetInterval(options.date(), intervals()));

	return {
		rise,
		riseSetTimes,
		set
	};
}
