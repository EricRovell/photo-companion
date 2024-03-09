import { isLatitude, isLongitude } from "@shared/utils";

import { RAD } from "../consts";
import { SUN_TIMES } from "./consts";
import { declination, toDays, eclipticLongitude } from "../utils";
import { approxTransit, getSetJ, fromJulianDay, julianCycle, observerAngle, solarMeanAnomaly, solarTransitJ } from "./utils";
import type { SunTime, SunEventName } from "../types";

/**
 * Calculates sun times for a given date and latitude/longitude.
 */
export function getSunTimes(dateValue: Date | number, latitude: number, longitude: number, height = 0, inUTC = false): Record<SunEventName, SunTime> {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	const t = new Date(dateValue);

	if (inUTC) {
		t.setUTCHours(12, 0, 0, 0);
	} else {
		t.setHours(12, 0, 0, 0);
	}

	const lw = RAD * -longitude;
	const phi = RAD * latitude;
	const dh = observerAngle(height || 0);
	const d = toDays(t.valueOf());
	const n = julianCycle(d, lw);
	const ds = approxTransit(0, lw, n);
	const M = solarMeanAnomaly(ds);
	const L = eclipticLongitude(M);
	const dec = declination(L, 0);

	const Jnoon = solarTransitJ(ds, M, L);
	const noonVal = fromJulianDay(Jnoon);
	const nadirVal = fromJulianDay(Jnoon + 0.5);

	const result: Partial<Record<SunEventName, SunTime>> = {
		SOLAR_NOON: {
			value: new Date(noonVal),
			ts: noonVal,
			name: "SOLAR_NOON",
			// elevation: 90,
			julian: Jnoon,
			valid: !isNaN(Jnoon),
			pos: SUN_TIMES.length
		},
		NADIR: {
			value: new Date(nadirVal),
			ts: nadirVal,
			name: "NADIR",
			// elevation: 270,
			julian: Jnoon + 0.5,
			valid: !isNaN(Jnoon),
			pos: (SUN_TIMES.length * 2) + 1
		}
	};

	for (let i = 0, len = SUN_TIMES.length; i < len; i += 1) {
		const time = SUN_TIMES[i];
		const sa = time.angle;
		const h0 = (sa + dh) * RAD;
		let valid = true;

		let Jset = getSetJ(h0, lw, phi, dec, n, M, L);
		if (isNaN(Jset)) {
			Jset = (Jnoon + 0.5);
			valid = false;
			/* Näherung an Wert
			const b = Math.abs(time[0]);
			while (isNaN(Jset) && ((Math.abs(sa) - b) < 2)) {
					sa += 0.005;
					Jset = getSetJ(sa * RAD, lw, phi, dec, n, M, L);
			} /* */
		}

		const Jrise = Jnoon - (Jset - Jnoon);
		const v1 = fromJulianDay(Jset);
		const v2 = fromJulianDay(Jrise);

		result[time.setName] = {
			value: new Date(v1),
			ts: v1,
			name: time.setName,
			elevation: sa,
			julian: Jset,
			valid,
			pos: len + i + 1
		};

		result[time.riseName] = {
			value: new Date(v2),
			ts: v2,
			name: time.riseName,
			elevation: sa, // (180 + (sa * -1)),
			julian: Jrise,
			valid,
			pos: len - i - 1
		};
	}

	return result as Record<SunEventName, SunTime>;
}
