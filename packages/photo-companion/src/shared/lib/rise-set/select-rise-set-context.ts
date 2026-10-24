import type { RiseSetInterval } from "moon-sun-calc";

import { selectRiseSetInterval } from "./select-rise-set-interval";

export interface BelowHorizonInterval {
	end: Date | null;
	start: Date | null;
}

export function selectRiseSetContext(date: Date, intervals: readonly RiseSetInterval[], selected = selectRiseSetInterval(date, intervals)) {
	const current = date.getTime();

	// Event links have whole seconds; calculator events can include milliseconds.
	const atEvent = (event: Date | null) => !!event && (
		event.getTime() === current ||
		(current % 1000 === 0 && Math.floor(event.getTime() / 1000) === current / 1000)
	);

	const upcoming = (event: Date | null) => !!event && event.getTime() > current && !atEvent(event);
	const nextRise = upcoming(selected.rise) ? selected.rise : intervals.find(({ rise }) => upcoming(rise))?.rise ?? null;
	const afterSet = !!selected.set && (selected.set.getTime() <= current || atEvent(selected.set));
	const end = afterSet ? nextRise : selected.rise;
	let start = afterSet ? selected.set : null;

	if (!afterSet && end) {
		const endTime = end.getTime();

		for (const { set } of intervals) {
			if (set && set.getTime() < endTime && (!start || set.getTime() > start.getTime())) {
				start = set;
			}
		}
	}

	const belowHorizonInterval: BelowHorizonInterval = { end, start };

	return {
		belowHorizonInterval,
		nextRise
	};
}
