import { isNullable } from "utils/validators";

import { J2000, RAD_TO_DEG } from "./consts";
import { clamp, normalizeDegrees, normalizeSignedDegrees, toRadians } from "./math";
import { julianCenturies, julianDayTerrestrial, julianDayUtc } from "./time";
import { validateAtmosphere } from "./validators";

import type { Atmosphere, Degree, Millisecond, Radian } from "../types";
import type {
	EclipticToEquatorialInput,
	EquatorialCoordinates,
	HorizontalCoordinates,
	HorizontalCoordinatesInput,
	Nutation
} from "./types";

export function meanObliquity(T: number): Degree {
	const seconds = 21.448 - 46.815 * T - 0.00059 * T ** 2 + 0.001813 * T ** 3;

	return 23 + 26 / 60 + seconds / 3600;
}

export function nutation(T: number): Nutation {
	const omega = toRadians(normalizeDegrees(125.04452 - 1934.136261 * T));
	const sunLongitude = toRadians(normalizeDegrees(280.4665 + 36_000.7698 * T));
	const moonLongitude = toRadians(normalizeDegrees(218.3165 + 481_267.8813 * T));

	return {
		longitude: (
			-17.2 * Math.sin(omega)
			- 1.32 * Math.sin(2 * sunLongitude)
			- 0.23 * Math.sin(2 * moonLongitude)
			+ 0.21 * Math.sin(2 * omega))
			/ 3600,
		obliquity: (
			9.2 * Math.cos(omega)
			+ 0.57 * Math.cos(2 * sunLongitude)
			+ 0.1 * Math.cos(2 * moonLongitude)
			- 0.09 * Math.cos(2 * omega))
			/ 3600
	};
}

export function eclipticToEquatorial({
	latitude,
	longitude,
	obliquity
}: EclipticToEquatorialInput): EquatorialCoordinates {
	const lambda = toRadians(longitude);
	const beta = toRadians(latitude);
	const epsilon = toRadians(obliquity);

	return {
		declination: Math.asin(Math.sin(beta) * Math.cos(epsilon)
			+ Math.cos(beta) * Math.sin(epsilon) * Math.sin(lambda)) * RAD_TO_DEG,
		rightAscension: normalizeDegrees(Math.atan2(
			Math.sin(lambda) * Math.cos(epsilon) - Math.tan(beta) * Math.sin(epsilon),
			Math.cos(lambda)
		) * RAD_TO_DEG)
	};
}

function apparentSiderealTime(timestamp: Millisecond): Degree {
	const jd = julianDayUtc(timestamp);
	const T = (jd - J2000) / 36_525;

	const mean = normalizeDegrees(
		280.46061837
		+ 360.98564736629 * (jd - J2000)
		+ 0.000387933 * T ** 2
		- T ** 3 / 38_710_000
	);

	const correction = nutation(julianCenturies(julianDayTerrestrial(timestamp)));

	return normalizeDegrees(mean + correction.longitude * Math.cos(toRadians(
		meanObliquity(T) + correction.obliquity
	)));
}

export function atmosphericRefraction(altitude: Degree, atmosphere: Atmosphere = {}): Degree {
	const { pressure, temperature } = validateAtmosphere(atmosphere);

	if (altitude < -1) {
		return 0;
	}

	const correction = 1.02 / Math.tan(toRadians(altitude + 10.3 / (altitude + 5.11))) / 60;

	return correction * (pressure / 1010) * (283 / (273 + temperature));
}

export function horizontalCoordinates({
	atmosphere,
	coordinates,
	distance,
	observer,
	timestamp
}: HorizontalCoordinatesInput): HorizontalCoordinates {
	const latitude = toRadians(observer.latitude);
	let declination = toRadians(coordinates.declination);
	let rightAscension = coordinates.rightAscension;
	let hourAngle = toRadians(normalizeSignedDegrees(apparentSiderealTime(timestamp) + observer.longitude - rightAscension));

	if (!isNullable(distance)) {
		const u = Math.atan(0.99664719 * Math.tan(latitude));
		const heightRatio = observer.elevation / 6_378_140;
		const rhoSinPhi = 0.99664719 * Math.sin(u) + heightRatio * Math.sin(latitude);
		const rhoCosPhi = Math.cos(u) + heightRatio * Math.cos(latitude);
		const parallax = Math.asin(6378.14 / distance);

		const deltaRightAscension = Math.atan2(
			-rhoCosPhi * Math.sin(parallax) * Math.sin(hourAngle),
			Math.cos(declination) - rhoCosPhi * Math.sin(parallax) * Math.cos(hourAngle)
		);

		declination = Math.atan2(
			(Math.sin(declination) - rhoSinPhi * Math.sin(parallax)) * Math.cos(deltaRightAscension),
			Math.cos(declination) - rhoCosPhi * Math.sin(parallax) * Math.cos(hourAngle)
		);

		rightAscension = normalizeDegrees(rightAscension + deltaRightAscension * RAD_TO_DEG);
		hourAngle -= deltaRightAscension;
	}

	const altitudeRadians = Math.asin(clamp({
		maximum: 1,
		minimum: -1,
		value: Math.sin(latitude) * Math.sin(declination)
			+ Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle)
	}));

	const altitude = altitudeRadians * RAD_TO_DEG;

	const azimuth = normalizeDegrees(Math.atan2(
		Math.sin(hourAngle),
		Math.cos(hourAngle) * Math.sin(latitude) - Math.tan(declination) * Math.cos(latitude)
	) * RAD_TO_DEG + 180);

	const parallacticAngle: Radian = Math.atan2(
		Math.sin(hourAngle),
		Math.tan(latitude) * Math.cos(declination) - Math.sin(declination) * Math.cos(hourAngle)
	);

	return {
		altitude,
		apparentAltitude: altitude + atmosphericRefraction(altitude, atmosphere),
		azimuth,
		declination: declination * RAD_TO_DEG,
		hourAngle: normalizeSignedDegrees(hourAngle * RAD_TO_DEG),
		parallacticAngle: parallacticAngle * RAD_TO_DEG,
		rightAscension
	};
}
