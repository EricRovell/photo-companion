import { horizontalCoordinates, toTimestamp, validateObserver } from "../shared";
import { getSunGeocentricCoords } from "./ephemeris";

import type { SunPosition, SunPositionInput } from "./types";

export function getSunPosition({ instant, observer, options = {} }: SunPositionInput): SunPosition {
	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);
	const coordinates = getSunGeocentricCoords(timestamp);

	const horizontal = horizontalCoordinates({
		atmosphere: options.atmosphere,
		coordinates,
		observer: location,
		timestamp
	});

	return {
		altitude: horizontal.altitude,
		apparentAltitude: horizontal.apparentAltitude,
		azimuth: horizontal.azimuth,
		declination: horizontal.declination,
		distance: coordinates.distance,
		rightAscension: horizontal.rightAscension,
		zenith: 90 - horizontal.altitude
	};
}
