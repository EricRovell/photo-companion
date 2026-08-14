import {
	eclipticToEquatorial,
	julianCenturies,
	julianDayTerrestrial,
	meanObliquity,
	normalizeDegrees,
	nutation,
	toRadians
} from "../shared";
import { LUNAR_LATITUDE_TERMS, LUNAR_LONGITUDE_DISTANCE_TERMS } from "./consts";

import type { GeocentricCoordinates } from "../shared";
import type { Millisecond } from "../types";

export function moonGeocentric(timestamp: Millisecond): GeocentricCoordinates {
	const jd = julianDayTerrestrial(timestamp);
	const T = julianCenturies(jd);

	const Lp = normalizeDegrees(
		218.3164477
		+ 481_267.88123421 * T
		- 0.0015786 * T ** 2
		+ T ** 3 / 538_841
		- T ** 4 / 65_194_000
	);

	const D = normalizeDegrees(
		297.8501921
		+ 445_267.1114034 * T
		- 0.0018819 * T ** 2
		+ T ** 3 / 545_868
		- T ** 4 / 113_065_000
	);

	const M = normalizeDegrees(
		357.5291092
		+ 35_999.0502909 * T
		- 0.0001536 * T ** 2
		+ T ** 3 / 24_490_000
	);

	const Mp = normalizeDegrees(
		134.9633964
		+ 477_198.8675055 * T
		+ 0.0087414 * T ** 2
		+ T ** 3 / 69_699
		- T ** 4 / 14_712_000
	);

	const F = normalizeDegrees(
		93.272095
		+ 483_202.0175233 * T
		- 0.0036539 * T ** 2
		- T ** 3 / 3_526_000
		+ T ** 4 / 863_310_000
	);

	const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;

	let sigmaLongitude = 0;
	let sigmaDistance = 0;

	for (const [ d, m, mp, f, longitude, distance ] of LUNAR_LONGITUDE_DISTANCE_TERMS) {
		const eccentricity = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E ** 2 : 1;
		const argument = toRadians(d * D + m * M + mp * Mp + f * F);

		sigmaLongitude += longitude * eccentricity * Math.sin(argument);
		sigmaDistance += distance * eccentricity * Math.cos(argument);
	}

	const A1 = toRadians(normalizeDegrees(119.75 + 131.849 * T));
	const A2 = toRadians(normalizeDegrees(53.09 + 479_264.29 * T));

	sigmaLongitude +=
		3958 * Math.sin(A1)
		+ 1962 * Math.sin(toRadians(Lp - F))
		+ 318 * Math.sin(A2);

	let sigmaLatitude = 0;

	for (const [ d, m, mp, f, latitude ] of LUNAR_LATITUDE_TERMS) {
		const eccentricity = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E ** 2 : 1;
		sigmaLatitude += latitude * eccentricity * Math.sin(toRadians(d * D + m * M + mp * Mp + f * F));
	}

	const A3 = toRadians(normalizeDegrees(313.45 + 481_266.484 * T));

	sigmaLatitude +=
		-2235 * Math.sin(toRadians(Lp))
		+ 382 * Math.sin(A3)
		+ 175 * Math.sin(A1 - toRadians(F))
		+ 175 * Math.sin(A1 + toRadians(F))
		+ 127 * Math.sin(toRadians(Lp - Mp))
		- 115 * Math.sin(toRadians(Lp + Mp));

	const corrections = nutation(T);
	const longitude = normalizeDegrees(Lp + sigmaLongitude / 1_000_000 + corrections.longitude);
	const latitude = sigmaLatitude / 1_000_000;
	const distance = 385_000.56 + sigmaDistance / 1000;

	return {
		...eclipticToEquatorial({
			latitude,
			longitude,
			obliquity: meanObliquity(T) + corrections.obliquity
		}),
		distance,
		eclipticLatitude: latitude,
		eclipticLongitude: longitude
	};
}
