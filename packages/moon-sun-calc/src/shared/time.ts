import {
	DAY_MS,
	J2000,
	UNIX_EPOCH_JD
} from "./consts";

import type { JulianDay, Millisecond } from "../types";

export function julianDayUtc(timestamp: Millisecond): JulianDay {
	return timestamp / DAY_MS + UNIX_EPOCH_JD;
}

function decimalYear(timestamp: Millisecond): number {
	const date = new Date(timestamp);
	const year = date.getUTCFullYear();
	const start = Date.UTC(year, 0, 1);
	const end = Date.UTC(year + 1, 0, 1);

	return year + (timestamp - start) / (end - start);
}

/** Espenak/Meeus polynomial approximation of TT - UT, in seconds. */
export function deltaTSeconds(timestamp: Millisecond): number {
	const year = decimalYear(timestamp);
	let t: number;

	if (year < 1860) {
		t = year - 1800;

		return 13.72 - 0.332_447 * t + 0.006_861_2 * t ** 2 + 0.004_111_6 * t ** 3
			- 0.000_374_36 * t ** 4 + 0.000_012_127_2 * t ** 5 - 0.000_000_169_9 * t ** 6
			+ 0.000_000_000_875 * t ** 7;
	}

	if (year < 1900) {
		t = year - 1860;

		return 7.62 + 0.5737 * t - 0.251_754 * t ** 2 + 0.016_806_68 * t ** 3
			- 0.000_447_362_4 * t ** 4 + t ** 5 / 233_174;
	}

	if (year < 1920) {
		t = year - 1900;

		return -2.79 + 1.494_119 * t - 0.059_893_9 * t ** 2 + 0.006_196_6 * t ** 3 - 0.000_197 * t ** 4;
	}

	if (year < 1941) {
		t = year - 1920;

		return 21.2 + 0.844_93 * t - 0.0761 * t ** 2 + 0.002_093_6 * t ** 3;
	}

	if (year < 1961) {
		t = year - 1950;

		return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
	}

	if (year < 1986) {
		t = year - 1975;

		return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
	}

	if (year < 2005) {
		t = year - 2000;

		return 63.86 + 0.3345 * t - 0.060_374 * t ** 2 + 0.001_727_5 * t ** 3
			+ 0.000_651_814 * t ** 4 + 0.000_023_735_99 * t ** 5;
	}

	if (year < 2050) {
		t = year - 2000;

		return 62.92 + 0.322_17 * t + 0.005_589 * t ** 2;
	}

	if (year < 2150) {
		return -20 + 32 * ((year - 1820) / 100) ** 2 - 0.5628 * (2150 - year);
	}

	t = (year - 1820) / 100;

	return -20 + 32 * t ** 2;
}

export function julianDayTerrestrial(timestamp: Millisecond): JulianDay {
	return julianDayUtc(timestamp) + deltaTSeconds(timestamp) / 86_400;
}

export function julianCenturies(julianDay: JulianDay): number {
	return (julianDay - J2000) / 36_525;
}

export function fromJulianDayUtc(julianDay: JulianDay): Date {
	return new Date((julianDay - UNIX_EPOCH_JD) * DAY_MS);
}
