import {
	eclipticToEquatorial,
	julianCenturies,
	julianDayTerrestrial,
	meanObliquity,
	normalizeDegrees,
	toRadians
} from "../shared";

import type { GeocentricCoordinates } from "../shared";
import type { Millisecond } from "../types";

export function getSunGeocentricCoords(timestamp: Millisecond): GeocentricCoordinates {
	const jd = julianDayTerrestrial(timestamp);
	const T = julianCenturies(jd);

	const meanLongitude = normalizeDegrees(280.46646 + 36_000.76983 * T + 0.0003032 * T ** 2);
	const meanAnomaly = normalizeDegrees(357.52911 + 35_999.05029 * T - 0.0001537 * T ** 2 + T ** 3 / 24_490_000);
	const anomaly = toRadians(meanAnomaly);

	const equation = (
		1.914602
		- 0.004817 * T
		- 0.000014 * T ** 2) * Math.sin(anomaly)
		+ (0.019993 - 0.000101 * T) * Math.sin(2 * anomaly)
		+ 0.000289 * Math.sin(3 * anomaly);

	const trueLongitude = meanLongitude + equation;
	const trueAnomaly = meanAnomaly + equation;
	const eccentricity = 0.016708634 - 0.000042037 * T - 0.0000001267 * T ** 2;

	const distanceAu = 1.000001018 * (1 - eccentricity ** 2)
		/ (1 + eccentricity * Math.cos(toRadians(trueAnomaly)));

	const omega = toRadians(125.04 - 1934.136 * T);
	const apparentLongitude = normalizeDegrees(trueLongitude - 0.00569 - 0.00478 * Math.sin(omega));
	const obliquity = meanObliquity(T) + 0.00256 * Math.cos(omega);

	return {
		...eclipticToEquatorial({ latitude: 0, longitude: apparentLongitude, obliquity }),
		distance: distanceAu * 149_597_870.7,
		eclipticLatitude: 0,
		eclipticLongitude: apparentLongitude
	};
}
