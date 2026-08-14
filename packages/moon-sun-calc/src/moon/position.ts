import {
	horizontalCoordinates,
	normalizeDegrees,
	toTimestamp,
	validateFiniteDegrees,
	validateObserver
} from "../shared";
import { moonGeocentric } from "./ephemeris";

import type { Degree } from "../types";
import type { MoonPosition, MoonPositionInput } from "./types";

export function getMoonPosition({ instant, observer, options = {} }: MoonPositionInput): MoonPosition {
	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);
	const coordinates = moonGeocentric(timestamp);
	const horizontal = horizontalCoordinates({
		atmosphere: options.atmosphere,
		coordinates,
		distance: coordinates.distance,
		observer: location,
		timestamp
	});

	return {
		altitude: horizontal.altitude,
		apparentAltitude: horizontal.apparentAltitude,
		azimuth: horizontal.azimuth,
		declination: horizontal.declination,
		distance: coordinates.distance,
		parallacticAngle: horizontal.parallacticAngle,
		rightAscension: horizontal.rightAscension,
		zenith: 90 - horizontal.altitude
	};
}

export function getMoonZenithAngle(brightLimbAngle: Degree, parallacticAngle: Degree): Degree {
	validateFiniteDegrees([ brightLimbAngle, parallacticAngle ]);

	return normalizeDegrees(brightLimbAngle - parallacticAngle);
}
