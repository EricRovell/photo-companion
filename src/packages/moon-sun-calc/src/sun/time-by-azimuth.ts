import { isLatitude, isLongitude } from "@shared/utils";

import { RAD, DAY_MS } from "../consts";
import { calcSunCoordinates } from "./coordinates";
import { siderealTime, toDays, azimuthCalc } from "../utils";

/**
 * Calculates time for a given azimuth angle for a given date and geoposition.
*/
export function getSunTimeByAzimuth(
	dateValue: Date | number,
	latitude: number,
	longitude: number,
	nazimuth: number,
	degree: number
): Date {
	if (isNaN(nazimuth)) {
		throw new Error("Azimuth is missing");
	}

	if (!isLatitude(latitude)) {
		throw new Error(`Invalid latitude value: ${latitude}`);
	}

	if (!isLongitude(longitude)) {
		throw new Error(`Invalid longitude value: ${longitude}`);
	}

	if (degree) {
		nazimuth = nazimuth * RAD;
	}

	const date = new Date(dateValue);
	const lw = RAD * -longitude;
	const phi = RAD * latitude;

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
