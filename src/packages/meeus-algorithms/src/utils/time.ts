import { DEG2H, J2000 } from "../consts";
import { getJulianCentury } from "./julian-day";
import { fmod24, fmod360 } from "./math";

import type { Degree, Hour, JulianDay } from "../types";

/**
 * The local mean sidereal time (sun's clock time)
 * for a given Julian Day at a given longitude on Earth.
 */
export function getLocalSiderealTime(jd: JulianDay, longitude: Degree): Hour {
	const t = getJulianCentury(jd);
	const greenwichSiderealTime: Degree = (
		280.46061837 +
		360.98564736629 * (jd - J2000) +
		0.000387933 * t * t -
		t * t * t / 38710000
	);

	return fmod24(fmod360(greenwichSiderealTime + longitude) * DEG2H);
}
