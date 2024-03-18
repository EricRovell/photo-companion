import { isLatitude, isLongitude } from "utils/validators";
import { incrementDateByDay, isSameDay } from "utils/date";

import { RAD } from "../consts";
import { SUN_TIMES } from "./consts";
import { declination, toDays, eclipticLongitude } from "../utils";
import { approxTransit, getSetJ, fromJulianDay, julianCycle, observerAngle, solarMeanAnomaly, solarTransitJ } from "./utils";
import type { SunTime, SunEventName } from "../types";

interface Options {
	height?: number;
	UTC?: boolean;
}

/**
 * The NADIR is calculated from the day BEFORE,
 * because the nadir is in the future and usually
 * takes place the next day.
 * 
 * The idea is to get events for current day.
 */
function getNadirTimestamp(date: Date | number, longitude: number, UTC = false) {
	const t = new Date(date);

	if (UTC) {
		t.setUTCHours(12, 0, 0, 0);
	} else {
		t.setHours(12, 0, 0, 0);
	}

	const lw = RAD * -longitude;
	const d = toDays(t.valueOf());
	const n = julianCycle(d, lw);
	const ds = approxTransit(0, lw, n);
	const M = solarMeanAnomaly(ds);
	const L = eclipticLongitude(M);

	const Jnoon = solarTransitJ(ds, M, L);

	return fromJulianDay(Jnoon + 0.5);
}

/**
 * Calculates sun times for a given date and latitude/longitude.
 */
export function getSunTimes(date: Date | number, latitude: number, longitude: number, options: Options = {}): Record<SunEventName, SunTime> {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	const { height = 0, UTC = false } = options;
	const t = new Date(date);

	if (UTC) {
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
	const noonVal = fromJulianDay(Jnoon);
	let nadirVal = fromJulianDay(Jnoon + 0.5);

	/**
	 * The NADIR is in the future.
	 * If it goes away into the next date, we calculate the previous one.
	 */
	if (!isSameDay(date, nadirVal, UTC)) {
		nadirVal = getNadirTimestamp(incrementDateByDay(date, -1), longitude, UTC);
	}

	// @ts-expect-error all properties will be added
	const result: Record<SunEventName, SunTime> = {};

	result.SOLAR_NOON = {
		timestamp: noonVal,
		name: "SOLAR_NOON",
		julian: Jnoon,
		valid: !isNaN(Jnoon),
		index: SUN_TIMES.length
	};

	result.NADIR = {
		timestamp: nadirVal,
		name: "NADIR",
		julian: Jnoon + 0.5,
		valid: !isNaN(Jnoon),
		index: (SUN_TIMES.length * 2) + 1
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
			timestamp: v1,
			name: time.setName,
			elevation: sa,
			julian: Jset,
			valid,
			index: len + i + 1
		};

		result[time.riseName] = {
			timestamp: v2,
			name: time.riseName,
			elevation: sa, // (180 + (sa * -1)),
			julian: Jrise,
			valid,
			index: len - i - 1
		};
	}

	return result;
}
