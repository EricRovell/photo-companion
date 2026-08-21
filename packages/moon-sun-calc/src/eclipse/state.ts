import { moonGeocentric } from "../moon/ephemeris";
import {
	clamp,
	horizontalCoordinates,
	toTimestamp,
	validateObserver
} from "../shared";
import { getSunGeocentricCoords } from "../sun/ephemeris";
import { MOON_RADIUS, SUN_RADIUS } from "./consts";
import {
	angularRadius,
	angularSeparation,
	circleOverlapArea,
	getHorizontalOffsets
} from "./geometry";

import type { Degree, Millisecond, Observer } from "../types";
import type {
	SolarEclipseBodyState,
	SolarEclipseInput,
	SolarEclipsePhase,
	SolarEclipseState
} from "./types";

function phase(sunRadius: Degree, moonRadius: Degree, separation: Degree): SolarEclipsePhase {
	if (separation >= sunRadius + moonRadius) {
		return "NONE";
	}

	if (moonRadius >= sunRadius + separation) {
		return "TOTAL";
	}

	if (sunRadius >= moonRadius + separation) {
		return "ANNULAR";
	}

	return "PARTIAL";
}

function getBodyState(horizontal: ReturnType<typeof horizontalCoordinates>, radius: number): SolarEclipseBodyState {
	return {
		altitude: horizontal.altitude,
		angularRadius: angularRadius(radius, horizontal.topocentricDistance),
		apparentAltitude: horizontal.apparentAltitude,
		azimuth: horizontal.azimuth
	};
}

export function calculateSolarEclipseState(timestamp: Millisecond, observer: Required<Observer>): SolarEclipseState {
	const sunCoordinates = getSunGeocentricCoords(timestamp);

	const sunHorizontal = horizontalCoordinates({
		coordinates: sunCoordinates,
		distance: sunCoordinates.distance,
		observer,
		timestamp
	});

	const sun = getBodyState(sunHorizontal, SUN_RADIUS);

	const moonCoordinates = moonGeocentric(timestamp);

	const moonHorizontal = horizontalCoordinates({
		coordinates: moonCoordinates,
		distance: moonCoordinates.distance,
		observer,
		timestamp
	});

	const moon = getBodyState(moonHorizontal, MOON_RADIUS);

	const separation = angularSeparation(sun.azimuth, sun.altitude, moon.azimuth, moon.altitude);
	const obscuration = circleOverlapArea(sun.angularRadius, moon.angularRadius, separation)
		/ (Math.PI * sun.angularRadius ** 2);

	return {
		moon: {
			...moon,
			offset: getHorizontalOffsets(sun.azimuth, sun.altitude, moon.azimuth, moon.altitude)
		},
		obscuration: clamp({ maximum: 1, minimum: 0, value: obscuration }),
		phase: phase(sun.angularRadius, moon.angularRadius, separation),
		separation,
		sun
	};
}

export function getSolarEclipseState({ instant, observer }: SolarEclipseInput): SolarEclipseState {
	return calculateSolarEclipseState(toTimestamp(instant), validateObserver(observer));
}
