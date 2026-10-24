import { horizonDip, horizontalCoordinates, roots, validateEventStep, validateInterval, validateObserver } from "../shared";
import { moonGeocentric } from "./ephemeris";

import type { RiseSetCrossing } from "../rise-set/types";
import type { Millisecond } from "../types";
import type { MoonEventsInput } from "./types";

export function findMoonHorizonCrossings({ interval, observer, options = {} }: MoonEventsInput): RiseSetCrossing[] {
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

	return roots({
		end,
		fn: moonAltitude,
		start,
		step
	}).map(time => ({
		direction: moonAltitude(Math.min(time + 1000, end - 1)) >= moonAltitude(Math.max(time - 1000, start))
			? "rising"
			: "setting",
		time: new Date(time)
	}));
}
