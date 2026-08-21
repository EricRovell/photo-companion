import { moonGeocentric } from "../moon/ephemeris";
import {
	clamp,
	horizontalCoordinates,
	normalizeDegrees,
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

import type { Millisecond, Observer } from "../types";
import type {
	LunarEclipseInput,
	LunarEclipsePhase,
	LunarEclipseState,
	SolarEclipseBodyState
} from "./types";

const DANJON_SHADOW_FACTOR = 1.01;
const EARTH_EQUATORIAL_RADIUS = 6378.14;

function getPhase(
	penumbraRadius: number,
	umbraRadius: number,
	moonRadius: number,
	separation: number
): LunarEclipsePhase {
	if (separation >= penumbraRadius + moonRadius) {
		return "NONE";
	}

	if (separation <= umbraRadius - moonRadius) {
		return "TOTAL";
	}

	if (separation < umbraRadius + moonRadius) {
		return "PARTIAL";
	}

	return "PENUMBRAL";
}

function getMagnitude(shadowRadius: number, moonRadius: number, separation: number): number {
	return (shadowRadius + moonRadius - separation) / (2 * moonRadius);
}

function getMoonState(
	horizontal: ReturnType<typeof horizontalCoordinates>,
	angularRadiusValue: number
): SolarEclipseBodyState {
	return {
		altitude: horizontal.altitude,
		angularRadius: angularRadiusValue,
		apparentAltitude: horizontal.apparentAltitude,
		azimuth: horizontal.azimuth
	};
}

export function calculateLunarEclipseState(
	timestamp: Millisecond,
	observer: Required<Observer>
): LunarEclipseState {
	const sunCoordinates = getSunGeocentricCoords(timestamp);
	const moonCoordinates = moonGeocentric(timestamp);

	const shadowCoordinates = {
		declination: -sunCoordinates.declination,
		rightAscension: normalizeDegrees(sunCoordinates.rightAscension + 180)
	};

	const moonHorizontal = horizontalCoordinates({
		coordinates: moonCoordinates,
		distance: moonCoordinates.distance,
		observer,
		timestamp
	});

	const shadowHorizontal = horizontalCoordinates({
		coordinates: shadowCoordinates,
		distance: moonCoordinates.distance,
		observer,
		timestamp
	});

	const moonAngularRadius = angularRadius(MOON_RADIUS, moonCoordinates.distance);
	const moonParallax = angularRadius(EARTH_EQUATORIAL_RADIUS, moonCoordinates.distance);
	const sunAngularRadius = angularRadius(SUN_RADIUS, sunCoordinates.distance);
	const sunParallax = angularRadius(EARTH_EQUATORIAL_RADIUS, sunCoordinates.distance);
	const penumbraAngularRadius = DANJON_SHADOW_FACTOR * moonParallax + sunAngularRadius + sunParallax;
	const umbraAngularRadius = DANJON_SHADOW_FACTOR * moonParallax - sunAngularRadius + sunParallax;

	const separation = angularSeparation(
		moonCoordinates.rightAscension,
		moonCoordinates.declination,
		shadowCoordinates.rightAscension,
		shadowCoordinates.declination
	);

	const umbralCoverage = circleOverlapArea(umbraAngularRadius, moonAngularRadius, separation)
		/ (Math.PI * moonAngularRadius ** 2);

	return {
		moon: {
			...getMoonState(moonHorizontal, moonAngularRadius),
			offset: getHorizontalOffsets(
				shadowHorizontal.azimuth,
				shadowHorizontal.altitude,
				moonHorizontal.azimuth,
				moonHorizontal.altitude
			)
		},
		penumbralMagnitude: getMagnitude(penumbraAngularRadius, moonAngularRadius, separation),
		phase: getPhase(penumbraAngularRadius, umbraAngularRadius, moonAngularRadius, separation),
		separation,
		shadow: {
			altitude: shadowHorizontal.altitude,
			apparentAltitude: shadowHorizontal.apparentAltitude,
			azimuth: shadowHorizontal.azimuth,
			penumbraAngularRadius,
			umbraAngularRadius
		},
		umbralCoverage: clamp({ maximum: 1, minimum: 0, value: umbralCoverage }),
		umbralMagnitude: getMagnitude(umbraAngularRadius, moonAngularRadius, separation)
	};
}

export function getLunarEclipseState({ instant, observer }: LunarEclipseInput): LunarEclipseState {
	return calculateLunarEclipseState(toTimestamp(instant), validateObserver(observer));
}
