import {
	horizonDip,
	horizontalCoordinates,
	meridianCrossings,
	roots,
	validateEventStep,
	validateInterval,
	validateObserver
} from "../shared";
import { moonGeocentric } from "./ephemeris";

import type { Millisecond } from "../types";
import type { MoonEvent, MoonEventsInput } from "./types";

export function getMoonEvents({ interval, observer, options = {} }: MoonEventsInput): MoonEvent[] {
	const { end, start } = validateInterval(interval);
	const location = validateObserver(observer);
	const step = validateEventStep(options);

	const moonAltitude = (time: Millisecond) => {
		const moon = moonGeocentric(time);
		const semidiameter = 0.2725 * Math.asin(6378.14 / moon.distance) * 180 / Math.PI;
		const standardAltitude = -0.5667 - semidiameter - horizonDip(location.elevation);
		return horizontalCoordinates({
			atmosphere: options.atmosphere,
			coordinates: moon,
			distance: moon.distance,
			observer: location,
			timestamp: time
		}).altitude - standardAltitude;
	};

	const events: MoonEvent[] = roots({ end, fn: moonAltitude, start, step }).map(time => ({
		name: moonAltitude(Math.min(time + 1000, end - 1)) >= moonAltitude(Math.max(time - 1000, start))
			? "MOONRISE" as const
			: "MOONSET" as const,
		time: new Date(time)
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
