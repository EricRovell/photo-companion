import { isLatitude, isLongitude } from "@shared/utils";

import { getMoonPosition } from "./position";
import { RAD } from "../consts";
import { hoursLater } from "./utils";
import type { MoonTimes } from "../types";

/**
* Calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article
*/
export function getMoonTimes(dateValue: Date | number, latitude: number, longitude: number, inUTC = false): MoonTimes {
	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	const t = new Date(dateValue);

	if (inUTC) {
		t.setUTCHours(0, 0, 0, 0);
	} else {
		t.setHours(0, 0, 0, 0);
	}

	dateValue = t.valueOf();

	const hc = 0.133 * RAD;
	let h0 = getMoonPosition(dateValue, latitude, longitude).altitude - hc;
	let rise;
	let set;
	let ye = 0;
	let d;
	let roots;
	let x1 = 0;
	let x2 = 0;
	let dx;

	// go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
	for (let i = 1; i <= 24; i += 2) {
		const h1 = getMoonPosition(hoursLater(dateValue, i), latitude, longitude).altitude - hc;
		const h2 = getMoonPosition(hoursLater(dateValue, i + 1), latitude, longitude).altitude - hc;

		const a = (h0 + h2) / 2 - h1;
		const b = (h2 - h0) / 2;
		const xe = -b / (2 * a);
		ye = (a * xe + b) * xe + h1;
		d = b * b - 4 * a * h1;
		roots = 0;

		if (d >= 0) {
			dx = Math.sqrt(d) / (Math.abs(a) * 2);
			x1 = xe - dx;
			x2 = xe + dx;

			if (Math.abs(x1) <= 1) {
				roots++;
			}

			if (Math.abs(x2) <= 1) {
				roots++;
			}

			if (x1 < -1) {
				x1 = x2;
			}
		}

		if (roots === 1) {
			if (h0 < 0) {
				rise = i + x1;
			} else {
				set = i + x1;
			}
		} else if (roots === 2) {
			rise = i + (ye < 0 ? x2 : x1);
			set = i + (ye < 0 ? x1 : x2);
		}

		if (rise && set) {
			break;
		}

		h0 = h2;
	}

	const result: Partial<MoonTimes> = {};

	result.rise = rise
		? new Date(hoursLater(dateValue, rise))
		: null;

	result.set = set
		? new Date(hoursLater(dateValue, set))
		: null;

	if (!rise && !set) {
		if (ye > 0) {
			result.alwaysUp = true;
			result.alwaysDown = false;
		} else {
			result.alwaysUp = false;
			result.alwaysDown = true;
		}
	} else if (rise && set) {
		result.alwaysUp = false;
		result.alwaysDown = false;
		result.highest = new Date(hoursLater(dateValue, Math.min(rise, set) + (Math.abs(set - rise) / 2)));
	} else {
		result.alwaysUp = false;
		result.alwaysDown = false;
	}

	return result as MoonTimes;
}
