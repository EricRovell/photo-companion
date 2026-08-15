import { moonGeocentric } from "../moon/ephemeris";
import {
	clamp,
	horizontalCoordinates,
	normalizeSignedDegrees,
	toDegrees,
	toRadians,
	toTimestamp,
	validateObserver
} from "../shared";
import { getSunGeocentricCoords } from "../sun/ephemeris";
import { MOON_RADIUS, SUN_RADIUS } from "./consts";

import type { Degree, Millisecond, Observer } from "../types";
import type {
	SolarEclipseBodyState,
	SolarEclipseInput,
	SolarEclipsePhase,
	SolarEclipseState
} from "./types";

interface Vector {
	x: number;
	y: number;
	z: number;
}

function horizontalVector(azimuth: Degree, altitude: Degree): Vector {
	const azimuthRadians = toRadians(azimuth);
	const altitudeRadians = toRadians(altitude);
	const horizontal = Math.cos(altitudeRadians);

	return {
		x: horizontal * Math.sin(azimuthRadians),
		y: horizontal * Math.cos(azimuthRadians),
		z: Math.sin(altitudeRadians)
	};
}

function dot(left: Vector, right: Vector): number {
	return left.x * right.x + left.y * right.y + left.z * right.z;
}

function getOffsets(
	sunAzimuth: Degree,
	sunAltitude: Degree,
	moonAzimuth: Degree,
	moonAltitude: Degree
): { altitude: Degree; azimuth: Degree } {
	const sunAzimuthRadians = toRadians(sunAzimuth);
	const sunAltitudeRadians = toRadians(sunAltitude);
	const sun = horizontalVector(sunAzimuth, sunAltitude);
	const moon = horizontalVector(moonAzimuth, moonAltitude);

	const azimuthBasis = {
		x: Math.cos(sunAzimuthRadians),
		y: -Math.sin(sunAzimuthRadians),
		z: 0
	};

	const altitudeBasis = {
		x: -Math.sin(sunAltitudeRadians) * Math.sin(sunAzimuthRadians),
		y: -Math.sin(sunAltitudeRadians) * Math.cos(sunAzimuthRadians),
		z: Math.cos(sunAltitudeRadians)
	};

	const forward = dot(moon, sun);

	return {
		altitude: toDegrees(Math.atan2(dot(moon, altitudeBasis), forward)),
		azimuth: toDegrees(Math.atan2(dot(moon, azimuthBasis), forward))
	};
}

function angularSeparation(
	leftAzimuth: Degree,
	leftAltitude: Degree,
	rightAzimuth: Degree,
	rightAltitude: Degree
): Degree {
	const leftAltitudeRadians = toRadians(leftAltitude);
	const rightAltitudeRadians = toRadians(rightAltitude);
	const azimuthDifference = toRadians(normalizeSignedDegrees(leftAzimuth - rightAzimuth));
	const cosine = Math.sin(leftAltitudeRadians) * Math.sin(rightAltitudeRadians)
		+ Math.cos(leftAltitudeRadians) * Math.cos(rightAltitudeRadians) * Math.cos(azimuthDifference);

	return toDegrees(Math.acos(clamp({ maximum: 1, minimum: -1, value: cosine })));
}

function angularRadius(radius: number, distance: number | undefined): Degree {
	if (distance === undefined) {
		throw new Error("Topocentric distance is required for eclipse calculations");
	}

	return toDegrees(Math.asin(clamp({ maximum: 1, minimum: -1, value: radius / distance })));
}

function overlapArea(sunRadius: Degree, moonRadius: Degree, separation: Degree): number {
	if (separation >= sunRadius + moonRadius) {
		return 0;
	}

	if (separation <= Math.abs(sunRadius - moonRadius)) {
		return Math.PI * Math.min(sunRadius, moonRadius) ** 2;
	}

	const sunTerm = Math.acos(clamp({
		maximum: 1,
		minimum: -1,
		value: (separation ** 2 + sunRadius ** 2 - moonRadius ** 2) / (2 * separation * sunRadius)
	}));

	const moonTerm = Math.acos(clamp({
		maximum: 1,
		minimum: -1,
		value: (separation ** 2 + moonRadius ** 2 - sunRadius ** 2) / (2 * separation * moonRadius)
	}));

	const triangle = 0.5 * Math.sqrt(Math.max(0,
		(-separation + sunRadius + moonRadius)
		* (separation + sunRadius - moonRadius)
		* (separation - sunRadius + moonRadius)
		* (separation + sunRadius + moonRadius)
	));

	return sunRadius ** 2 * sunTerm + moonRadius ** 2 * moonTerm - triangle;
}

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
	const obscuration = overlapArea(sun.angularRadius, moon.angularRadius, separation)
		/ (Math.PI * sun.angularRadius ** 2);

	return {
		moon: {
			...moon,
			offset: getOffsets(sun.azimuth, sun.altitude, moon.azimuth, moon.altitude)
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
