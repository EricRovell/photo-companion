import {
	angularDifference,
	horizonDip,
	horizontalCoordinates,
	meridianCrossings,
	roots,
	validateAltitude,
	validateAzimuth,
	validateEventStep,
	validateInterval,
	validateObserver
} from "../shared";
import { SUN_ALTITUDE_EVENTS } from "./consts";
import { getSunGeocentricCoords } from "./ephemeris";

import type { Millisecond } from "../types";
import type {
	AzimuthCrossing,
	Crossing,
	SunAltitudeCrossingsInput,
	SunAzimuthCrossingsInput,
	SunEvent,
	SunEventsInput
} from "./types";

export function findSunAltitudeCrossings({
	altitude,
	interval,
	observer,
	options = {}
}: SunAltitudeCrossingsInput): Crossing[] {
	const { end, start } = validateInterval(interval);
	const location = validateObserver(observer);

	const target = validateAltitude(altitude) - horizonDip(location.elevation);

	const value = (time: Millisecond) => horizontalCoordinates({
		atmosphere: options.atmosphere,
		coordinates: getSunGeocentricCoords(time),
		observer: location,
		timestamp: time
	}).altitude - target;

	return roots({ end, fn: value, start, step: validateEventStep(options) }).map(time => ({
		direction: value(Math.min(time + 1000, end - 1)) >= value(Math.max(time - 1000, start)) ? "rising" : "setting",
		time: new Date(time)
	}));
}

export function findSunAzimuthCrossings({
	azimuth,
	interval,
	observer,
	options = {}
}: SunAzimuthCrossingsInput): AzimuthCrossing[] {
	const { end, start } = validateInterval(interval);
	const location = validateObserver(observer);

	const target = validateAzimuth(azimuth);

	const position = (time: Millisecond) => horizontalCoordinates({
		atmosphere: options.atmosphere,
		coordinates: getSunGeocentricCoords(time),
		observer: location,
		timestamp: time
	});

	const value = (time: Millisecond) => angularDifference(position(time).azimuth, target);

	return roots({
		end,
		fn: value,
		isContinuous: (left, right) => Math.abs(left - right) < 180,
		start,
		step: validateEventStep(options)
	}).map(time => {
		const crossing = position(time);
		return {
			altitude: crossing.altitude,
			apparentAltitude: crossing.apparentAltitude,
			time: new Date(time)
		};
	});
}

export function getSunEvents({ interval, observer, options = {} }: SunEventsInput): SunEvent[] {
	const { end, start } = validateInterval(interval);
	const location = validateObserver(observer);
	const events: SunEvent[] = [];

	for (const [ altitude, riseName, setName ] of SUN_ALTITUDE_EVENTS) {
		for (const crossing of findSunAltitudeCrossings({
			altitude,
			interval: { end, start },
			observer: location,
			options
		})) {
			events.push({ altitude, name: crossing.direction === "rising" ? riseName : setName, time: crossing.time });
		}
	}

	const step = validateEventStep(options);

	const hourAngle = (time: Millisecond) => horizontalCoordinates({
		coordinates: getSunGeocentricCoords(time),
		observer: location,
		timestamp: time
	}).hourAngle;

	for (const event of meridianCrossings({ end, hourAngle, start, step })) {
		events.push({ name: event.kind === "transit" ? "SOLAR_NOON" : "NADIR", time: new Date(event.time) });
	}

	return events.sort((left, right) => left.time.getTime() - right.time.getTime());
}
