import {
	horizontalCoordinates,
	meridianCrossings,
	validateEventStep,
	validateInterval,
	validateObserver
} from "../shared";
import { findMoonHorizonCrossings } from "./crossings";
import { moonGeocentric } from "./ephemeris";

import type { Millisecond } from "../types";
import type { MoonEvent, MoonEventsInput } from "./types";

export function getMoonEvents({ interval, observer, options = {} }: MoonEventsInput): MoonEvent[] {
	const { end, start } = validateInterval(interval);
	const location = validateObserver(observer);
	const step = validateEventStep(options);

	const events: MoonEvent[] = findMoonHorizonCrossings({ interval: { end, start }, observer: location, options }).map(crossing => ({
		name: crossing.direction === "rising" ? "MOONRISE" : "MOONSET",
		time: crossing.time
	}));

	const hourAngle = (time: Millisecond) => {
		const moon = moonGeocentric(time);

		return horizontalCoordinates({
			coordinates: moon,
			distance: moon.distance,
			observer: location,
			timestamp: time
		}).hourAngle;
	};

	for (const event of meridianCrossings({ end, hourAngle, start, step })) {
		events.push({ name: event.kind === "transit" ? "MOON_TRANSIT" : "MOON_ANTITRANSIT", time: new Date(event.time) });
	}

	return events.sort((left, right) => left.time.getTime() - right.time.getTime());
}
