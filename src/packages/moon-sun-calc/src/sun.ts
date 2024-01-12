import { RAD, DEGREES, DAY_MS, sunTimes } from "./consts";
import {
	declination,
	siderealTime,
	toDays,
	azimuthCalc,
	altitudeCalc,
	fromJulianDay,
	getSetJ,
	calcSunCoordinates,
	observerAngle,
	julianCycle,
	solarMeanAnomaly,
	eclipticLongitude,
	approxTransit,
	solarTransitJ
} from "./utils";
import type { SunPosition, SunTime, SunEventName } from "./types";

// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

/**
 * Calculates the Sun position for a given date and geoposition coordinates.
*/
export function getSunPosition(dateValue: Date | number, lat: number, lng: number): SunPosition {
	if (isNaN(lat)) {
		throw new Error("latitude missing");
	}

	if (isNaN(lng)) {
		throw new Error("longitude missing");
	}

	if (dateValue instanceof Date) {
		dateValue = dateValue.valueOf();
	}

	const lw = RAD * -lng;
	const phi = RAD * lat;
	const d = toDays(dateValue);
	const c = calcSunCoordinates(d);
	const H = siderealTime(d, lw) - c.ra;
	const azimuth = azimuthCalc(H, phi, c.dec);
	const altitude = altitudeCalc(H, phi, c.dec);

	return {
		azimuth,
		altitude,
		zenith: (90*Math.PI/180) - altitude,
		azimuthDegrees: DEGREES * azimuth,
		altitudeDegrees: DEGREES * altitude,
		zenithDegrees: 90 - (DEGREES * altitude),
		declination: c.dec
	};
}

/**
 * Calculates sun times for a given date and latitude/longitude.
 */
export function getSunTimes(dateValue: Date | number, lat: number, lng: number, height = 0, inUTC = false): Record<SunEventName, SunTime> {
	if (isNaN(lat)) {
		throw new Error("latitude missing");
	}

	if (isNaN(lng)) {
		throw new Error("longitude missing");
	}

	const t = new Date(dateValue);

	if (inUTC) {
		t.setUTCHours(12, 0, 0, 0);
	} else {
		t.setHours(12, 0, 0, 0);
	}

	const lw = RAD * -lng;
	const phi = RAD * lat;
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
		"solar-noon": {
			value: new Date(noonVal),
			ts: noonVal,
			name: "solar-noon",
			// elevation: 90,
			julian: Jnoon,
			valid: !isNaN(Jnoon),
			pos: sunTimes.length
		},
		"nadir": {
			value: new Date(nadirVal),
			ts: nadirVal,
			name: "nadir",
			// elevation: 270,
			julian: Jnoon + 0.5,
			valid: !isNaN(Jnoon),
			pos: (sunTimes.length * 2) + 1
		}
	};

	for (let i = 0, len = sunTimes.length; i < len; i += 1) {
		const time = sunTimes[i];
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

/**
 * calculates the time at which the sun will have a given elevation angle when rising and when setting for a given date and latitude/longitude.
 * @param {number|Date} dateValue Date object or timestamp for calculating sun-times
 * @param {number} lat latitude for calculating sun-times
 * @param {number} lng longitude for calculating sun-times
 * @param {number} elevationAngle sun angle for calculating sun-time
 * @param {number} [height=0]  the observer height (in meters) relative to the horizon
 * @param {boolean} [degree] defines if the elevationAngle is in degree not in radians
 * @param {boolean} [inUTC] defines if the calculation should be in utc or local time (default is local)
 * @return {ISunTimeSingle} result object of single sunTime
 */
export function getSunTime(
	dateValue: Date | number,
	lat: number, lng: number,
	elevationAngle: number,
	height: number,
	degree: number,
	inUTC: boolean
): { set: SunTime, rise: SunTime } {
	if (isNaN(lat)) {
		throw new Error("latitude missing");
	}

	if (isNaN(lng)) {
		throw new Error("longitude missing");
	}

	if (isNaN(elevationAngle)) {
		throw new Error("elevationAngle missing");
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

	const lw = RAD * -lng;
	const phi = RAD * lat;
	const dh = observerAngle(height || 0);
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

/**
 * Calculates time for a given azimuth angle for a given date and latitude/longitude
 * @param {number|Date} dateValue Date object or timestamp for calculating sun-time
 * @param {number} nazimuth azimuth for calculating sun-time
 * @param {number} lat latitude for calculating sun-time
 * @param {number} lng longitude for calculating sun-time
 * @param {boolean} [degree] true if the angle is in degree and not in rad
 * @return {Date} result time of sun-time
*/
export function getSunTimeByAzimuth(dateValue: Date | number, lat: number, lng: number, nazimuth: number, degree: number): Date {
	if (isNaN(nazimuth)) {
		throw new Error("azimuth missing");
	}

	if (isNaN(lat)) {
		throw new Error("latitude missing");
	}

	if (isNaN(lng)) {
		throw new Error("longitude missing");
	}

	if (degree) {
		nazimuth = nazimuth * RAD;
	}

	const date = new Date(dateValue);
	const lw = RAD * -lng;
	const phi = RAD * lat;

	let dateVal = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).valueOf();
	let addval = DAY_MS; // / 2);
	dateVal += addval;

	while (addval > 200) {
		// let nazi = this.getPosition(dateVal, lat, lng).azimuth;
		const d = toDays(dateVal);
		const c = calcSunCoordinates(d);
		const H = siderealTime(d, lw) - c.ra;
		const nazim = azimuthCalc(H, phi, c.dec);

		addval /= 2;

		if (nazim < nazimuth) {
			dateVal += addval;
		} else {
			dateVal -= addval;
		}
	}

	return new Date(Math.floor(dateVal));
}
