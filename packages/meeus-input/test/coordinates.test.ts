import { describe, expect, test } from "vitest";

import { H2DEG } from "../src/constants";
import {
	getDeclinationFromEcliptic,
	getParallacticAngle,
	getRightAscensionFromEcliptic
} from "../src/coordinates";
import { getJulianDay } from "../src/juliandays";
import { getDecimalValue } from "../src/sexagesimal";

describe("coordinates", () => {
	test("parallactic angle before meridian", () => {
		const utcDate = new Date(Date.UTC(2017, 5, 14, 2, 0, 0.0));
		const jd = getJulianDay(utcDate);

		// gro_j1655_40, see below
		const ra = getDecimalValue(16, 54, 0.14); // in hours
		const dec = getDecimalValue(-39, 50, 44.9);
		const equCoords = { declination: dec, rightAscension: ra * H2DEG };

		// http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
		const lng = getDecimalValue(-70, 44, 7.662); // east-positive
		const lat = getDecimalValue(-29, 15, 14.235);
		const geoCoords = { latitude: lat, longitude: lng };

		// See https://www.eso.org/sci/observing/tools/calendar/ParAng.html to check values.
		const refAngle = -78.1;

		expect(getParallacticAngle(jd, equCoords, geoCoords)).toBeCloseTo(refAngle, 0);
		expect(getParallacticAngle(jd, equCoords, geoCoords, false)).toBeCloseTo(refAngle, 0);
	});

	test("parallactic angle after meridian", () => {
		const utcDate = new Date(Date.UTC(2017, 5, 14, 6, 0, 0.0));
		const jd = getJulianDay(utcDate);

		// gro_j1655_40, see below
		const ra = getDecimalValue(16, 54, 0.14); // in hours
		const dec = getDecimalValue(-39, 50, 44.9);
		const equCoords = { declination: dec, rightAscension: ra * H2DEG };

		// http://www.ls.eso.org/lasilla/Telescopes/2p2/D1p5M/
		const lng = getDecimalValue(-70, 44, 7.662); // east-positive
		const lat = getDecimalValue(-29, 15, 14.235);
		const geoCoords = { latitude: lat, longitude: lng };

		// Slightly adjusted values. Ref might not be 100% accurate...
		// Looking for improved reference values...
		const refAngle = 74.4;

		expect(getParallacticAngle(jd, equCoords, geoCoords)).toBeCloseTo(refAngle, 0);
		expect(getParallacticAngle(jd, equCoords, geoCoords, false)).toBeCloseTo(refAngle, 0);
	});

	// See AA p95, Ex 13.a
	test("transform ecliptic to equatorial", () => {
		const pollux = {
			declination: getDecimalValue(28, 1, 34.26),
			rightAscension: getDecimalValue(7, 45, 18.946) * H2DEG
		};
		const ecliptic = {
			latitude: 6.684170,
			longitude: 113.215630
		};
		const alpha = getRightAscensionFromEcliptic(ecliptic);
		expect(alpha).toBeCloseTo(pollux.rightAscension, 5);
		const delta = getDeclinationFromEcliptic(ecliptic);
		expect(delta).toBeCloseTo(pollux.declination, 6);
	});
});
