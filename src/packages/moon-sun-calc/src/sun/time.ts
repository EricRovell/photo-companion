import { isLatitude, isLongitude } from "utils/validators";

import { RAD } from "../consts";
import { declination, eclipticLongitude, toDays } from "../utils";
import { approxTransit, fromJulianDay, getSetJ, julianCycle, observerAngle, solarMeanAnomaly, solarTransitJ } from "./utils";

import type { SunTime } from "./types";

interface Options {
	degrees?: boolean;
	height?: number;
}

interface SunTimeByElevation {
	rise: SunTime;
	set: SunTime;
}

/**
 * Calculates the time at which the sun will have a given elevation angle
 * when rising and when setting for a given date and geoposition.
 * 
 * The observer `height` (in meters) relative to the horizon can be specified via options.
 * The elevation angle input is in radians by default.
 */
export function getSunTime(
	date: DateLike,
	latitude: number,
	longitude: number,
	elevationAngle: number,
	options: Options = {}
): SunTimeByElevation {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	if (isNaN(elevationAngle)) {
		throw new Error(`Invalid elevation angle is provided: ${elevationAngle}`);
	}

	const { degrees = false, height = 0 } = options;

	if (degrees) {
		elevationAngle = elevationAngle * RAD;
	}

	const t = new Date(date);

	t.setHours(12, 0, 0, 0);

	const lw = RAD * -longitude;
	const phi = RAD * latitude;
	const dh = observerAngle(height);
	const d = toDays(t.valueOf());
	const n = julianCycle(d, lw);
	const ds = approxTransit(0, lw, n);
	const M = solarMeanAnomaly(ds);
	const L = eclipticLongitude(M);
	const dec = declination(L, 0);
	const Jnoon = solarTransitJ(ds, M, L);

	const h0 = (elevationAngle - 0.833 + dh) * RAD;

	const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
	const Jrise = Jnoon - (Jset - Jnoon);
	const v1 = fromJulianDay(Jset);
	const v2 = fromJulianDay(Jrise);

	return {
		rise: {
			elevation: elevationAngle, // (180 + (elevationAngle * -1)),
			index: 1,
			julian: Jrise,
			name: "rise",
			timestamp: v2,
			valid: !isNaN(Jrise)
		},
		set: {
			elevation: elevationAngle,
			index: 0,
			julian: Jset,
			name: "set",
			timestamp: v1,
			valid: !isNaN(Jset)
		}
	};
}
