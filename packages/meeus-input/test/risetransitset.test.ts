import { describe, expect, test } from "vitest";

import { H2DEG, juliandays, STANDARD_ALTITUDE_STARS, Sun } from "../src";
import { getJulianDayMidnight } from "../src/juliandays";
import { getAccurateRiseTransitSetTimes, getRiseTransitSetTimes } from "../src/risetransitset";
import { getDecimalValue, getSexagesimalValue } from "../src/sexagesimal";

describe("rise transit & sets", () => {
	test("circumpolar transit", () => {
		const jd = juliandays.getJulianDay();
		const results = getRiseTransitSetTimes(
			jd,
			{ declination: -89.23, rightAscension: 0 },
			{ latitude: -70, longitude: 0 },
			STANDARD_ALTITUDE_STARS
		);
		expect(results.transit.isCircumpolar).toBeTruthy();
		expect(results.transit.isAboveHorizon).toBeTruthy();
		expect(results.transit.isAboveAltitude).toBeTruthy();
		expect(results.rise.utc).toBeUndefined();
		expect(results.set.utc).toBeUndefined();
	});

	test("circumpolar transit [low precision]", () => {
		const jd = juliandays.getJulianDay();
		const results = getRiseTransitSetTimes(
			jd,
			{ declination: -89.23, rightAscension: 0 },
			{ latitude: -70, longitude: 0 },
			STANDARD_ALTITUDE_STARS,
			false
		);
		expect(results.transit.isCircumpolar).toBeTruthy();
		expect(results.transit.isAboveHorizon).toBeTruthy();
		expect(results.transit.isAboveAltitude).toBeTruthy();
		expect(results.rise.utc).toBeUndefined();
		expect(results.set.utc).toBeUndefined();
	});

	// See AA, pp 103 & 104
	test("approximate Venus on 1988 March 20 at Boston", () => {
		const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0));
		const jd = juliandays.getJulianDay(date);
		const coordsBoston = { latitude: 42.3333, longitude: -71.0833 };
		const coordsVenus = { declination: 18.44092, rightAscension: 41.73129 };
		const results = getRiseTransitSetTimes(jd, coordsVenus, coordsBoston);
		expect(results.transit.isCircumpolar).toBeFalsy();
		expect(results.transit.isAboveHorizon).toBeTruthy();
		expect(results.transit.isAboveAltitude).toBeTruthy();
		expect(results.rise.utc).toBeCloseTo(24 * 0.51766, 1);
		expect(results.transit.utc).toBeCloseTo(24 * 0.81980, 1);
		expect(results.set.utc).toBeCloseTo(24 * 0.12130, 2);
		expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy();
		expect(results.transit.julianDay < results.set.julianDay).toBeTruthy();
	});

	// See AA, pp 103 & 104
	test("accurate Venus on 1988 March 20 at Boston", () => {
		const date = new Date(Date.UTC(1988, 2, 20, 0, 0, 0));
		const jd = juliandays.getJulianDay(date);
		const coordsBoston = { latitude: 42.3333, longitude: -71.0833 };

		const Theta0 = juliandays.getLocalSiderealTime(getJulianDayMidnight(jd), 0) * H2DEG;
		expect(Theta0).toBeCloseTo(177.742_08, 2);

		// In TD not UT, see AA p.103
		const venus = [
			{ declination: getDecimalValue(18, 2, 54.4), rightAscension: getDecimalValue(2, 42, 43.25) * H2DEG },
			{ declination: getDecimalValue(18, 26, 27.3), rightAscension: getDecimalValue(2, 46, 55.51) * H2DEG },
			{ declination: getDecimalValue(18, 18, 49, 38.7), rightAscension: getDecimalValue(2, 51, 7.69) * H2DEG }
		];
		const results = getAccurateRiseTransitSetTimes(jd, venus, coordsBoston, STANDARD_ALTITUDE_STARS, 2);
		expect(results.transit.isCircumpolar).toBeFalsy();
		expect(results.transit.isAboveHorizon).toBeTruthy();
		expect(results.transit.isAboveAltitude).toBeTruthy();

		// Our results don't agree perfectly with AA decimals?
		let { minutes, radix } = getSexagesimalValue(results.rise.utc);
		expect(radix).toEqual(12);
		expect(minutes).toEqual(26); // in AA, it is 25

		({ minutes, radix } = getSexagesimalValue(results.transit.utc));
		expect(radix).toEqual(19);
		expect(minutes).toEqual(40); // in AA, it is 41

		({ minutes, radix } = getSexagesimalValue(results.set.utc));
		expect(radix).toEqual(2);
		expect(minutes).toEqual(54);

		expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy();
		expect(results.transit.julianDay < results.set.julianDay).toBeTruthy();
	});

	test("arcsecond night slider unit test", () => {
		const night = {
			date: Date.UTC(2021, 10, 2, 2, 24, 37, 0), // "2021-11-02T02:24:37.000Z",
			getKey: null,
			isValid: null,
			limits: "day",
			locked: false,
			scale: 1,
			shift: 0,
			site: {
				address: { time_zone_id: "America/Santiago", time_zone_utc_offset: -14400 },
				coordinates: { altitude: 2200, latitude: -29.455, longitude: -72.34 }
			},
			slide: 0.5,
			threshold: 1,
			tracking: false
		};
		const jd = juliandays.getJulianDay(night.date);
		const jd0 = juliandays.getJulianDayMidnightDynamicalTime(jd);
		const sunCoords = Sun.getApparentGeocentricEquatorialCoordinates(jd0, false);
		const results = getRiseTransitSetTimes(jd, sunCoords, night.site.coordinates, -0.8333, false);
		expect(results.transit.isCircumpolar).toBeFalsy();
		expect(results.transit.isAboveHorizon).toBeTruthy();
		expect(results.transit.isAboveAltitude).toBeTruthy();
		expect(results.rise.julianDay < results.transit.julianDay).toBeTruthy();
		expect(results.transit.julianDay < results.set.julianDay).toBeTruthy();
	});

	test("sun rise transit set", () => {
		const geoCoords = { altitude: 2200, latitude: -29.455, longitude: -72.34 };
		const jd = juliandays.getJulianDay();
		const jd0 = juliandays.getJulianDayMidnightDynamicalTime(jd);
		const sunCoords = Sun.getApparentGeocentricEquatorialCoordinates(jd0, false);
		const resultsManual = getRiseTransitSetTimes(jd, sunCoords, geoCoords, -0.8333, false);
		const resultsSun = Sun.getRiseTransitSet(jd, geoCoords, false);
		expect(resultsManual.transit.isCircumpolar).toEqual(resultsSun.transit.isCircumpolar);
		expect(resultsManual.transit.isAboveHorizon).toEqual(resultsSun.transit.isAboveHorizon);
		expect(resultsManual.transit.isAboveAltitude).toEqual(resultsSun.transit.isAboveAltitude);
		expect(resultsManual.rise.utc).toEqual(resultsSun.rise.utc);
		expect(resultsManual.transit.utc).toEqual(resultsSun.transit.utc);
		expect(resultsManual.set.utc).toEqual(resultsSun.set.utc);
		expect(resultsManual.rise.julianDay).toEqual(resultsSun.rise.julianDay);
		expect(resultsManual.transit.julianDay).toEqual(resultsSun.transit.julianDay);
	});
});
