import { isLatitude, isLongitude } from "utils/validators";

import { RAD } from "../consts";
import { declination, toDays, eclipticLongitude } from "../utils";
import { approxTransit, getSetJ, fromJulianDay, julianCycle, observerAngle, solarMeanAnomaly, solarTransitJ } from "./utils";
import type { SunTime } from "../types";

/**
 * Calculates the time at which the sun will have a given elevation angle
 * when rising and when setting for a given date and geoposition.
 * 
 * `height` is the observer height (in meters) relative to the horizon,
 * `degree` defines if the elevationAngle is in degree not in radians.
 */
export function getSunTime(
	dateValue: Date | number,
	latitude: number,
	longitude: number,
	elevationAngle: number,
	height = 0,
	degree = false,
	inUTC = false
): { set: SunTime, rise: SunTime } {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	if (isNaN(elevationAngle)) {
		throw new Error(`Invalid elevation angle is provided: ${elevationAngle}`);
	}

	if (degree) {
		elevationAngle = elevationAngle * RAD;
	}

	const t = new Date(dateValue);

	if (inUTC) {
		t.setUTCHours(12, 0, 0, 0);
	} else {
		t.setHours(12, 0, 0, 0);
	}

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
		set: {
			name: "set",
			value: new Date(v1),
			ts: v1,
			elevation: elevationAngle,
			julian: Jset,
			valid: !isNaN(Jset),
			pos: 0
		},
		rise: {
			name: "rise",
			value: new Date(v2),
			ts: v2,
			elevation: elevationAngle, // (180 + (elevationAngle * -1)),
			julian: Jrise,
			valid: !isNaN(Jrise),
			pos: 1
		}
	};
}
