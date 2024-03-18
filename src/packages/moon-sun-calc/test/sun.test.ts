import { describe, expect, it } from "vitest";
import { getSunPosition,getSunTime,getSunTimes } from "../src";
import {
	DATE,
	HEIGHT,
	HEIGHT_TIMES,
	LAT,
	LAT_SOUTHERN_HEMISPHERE,
	LNG,
	LNG_SOUTHERN_HEMISPHERE,
	TIMES_NORTH_HEMISPHERE,
	TIMES_SOUTH_HEMISPHERE
} from "./fixtures";

expect.extend({
	toHaveDifference(received: number, expected: number, precision: number) {
		const difference =  Math.abs(received - expected);
		const pass = difference < precision;

		return {
			pass,
			message: () =>
				`expected ${received} to be close to ${expected} with precision ${precision}, differenece is ${difference}`
		};
	}
});

describe("Sun", () => {
	it("getPosition returns azimuth and altitude for the given time and location", () => {
		/*
		{
			azimuth: 0.6412750628729547,
			altitude: -0.7000406838781611,
			zenith: 2.2708370106730578,
			azimuthDegrees: 36.742354609606814,
			altitudeDegrees: -40.10937667367048,
			zenithDegrees: 130.10937667367048,
			declination: -0.10749006348638547
		}
		*/
		const position = getSunPosition(DATE, LAT, LNG);
		const positionDegrees = getSunPosition(DATE, LAT, LNG, true);

		expect(position.azimuth).toBeCloseTo(0.6412750628729547, 10);
		expect(position.altitude).toBeCloseTo(-0.7000406838781611, 10);
		expect(positionDegrees.azimuth).toBeCloseTo(36.742354609606814, 10);
		expect(positionDegrees.altitude).toBeCloseTo(-40.10937667367048, 10);
	});
	it("getPosition returns azimuth and altitude for the given time and location (southern hemisphere)", () => {
		/*
		{
			azimuth: 0.9416994558253937,
			altitude: 0.8642295669265889,
			zenith: 0.7065667598683076,
			azimuthDegrees: 53.95540438856136,
			altitudeDegrees: 49.51670671531246,
			zenithDegrees: 40.48329328468754,
			declination: -0.10749006348638547
		}
		*/
		const position = getSunPosition(DATE, LAT_SOUTHERN_HEMISPHERE, LNG_SOUTHERN_HEMISPHERE);
		const positionDegrees = getSunPosition(DATE, LAT_SOUTHERN_HEMISPHERE, LNG_SOUTHERN_HEMISPHERE, true);

		expect(position.azimuth).toBeCloseTo(0.9416994558253937, 2);
		expect(position.altitude).toBeCloseTo(0.8642295669265889, 2);
		expect(positionDegrees.azimuth).toBeCloseTo(54.13110438856136, 1);
		expect(positionDegrees.altitude).toBeCloseTo(49.30800671531246, 1);
	});
	it("getTimes returns sun phases for the given date and location", () => {
		const times = getSunTimes(DATE, LAT, LNG, { UTC: true });

		for (const { event, timestamp } of TIMES_NORTH_HEMISPHERE) {
			expect(timestamp).toHaveDifference(times[event].timestamp, 1000);
		}
	});
	it("getTimes returns sun phases for the given date and location in Southern hemosphere", () => {
		const times = getSunTimes(DATE, LAT_SOUTHERN_HEMISPHERE, LNG_SOUTHERN_HEMISPHERE);

		for (const { event, timestamp } of TIMES_SOUTH_HEMISPHERE) {
			expect(timestamp).toHaveDifference(times[event].timestamp, 1000);
		}
	});
	it("getTimes adjusts sun phases when additionally given the observer height", () => {
		const times = getSunTimes(DATE, LAT, LNG, { height: HEIGHT, UTC: true });

		for (const { event, timestamp } of HEIGHT_TIMES) {
			expect(timestamp).toHaveDifference(times[event].timestamp, 1000);
		}
	});
	it("getSunTime returns the correct time for the given date and location", () => {
		const times = getSunTime(DATE, LAT, LNG, 0);

		const sunriseStartTime = TIMES_NORTH_HEMISPHERE.find(({ event }) => event === "SUNRISE_START");
		const sunsetEndTime = TIMES_NORTH_HEMISPHERE.find(({ event }) => event === "SUNSET_END");

		expect(sunriseStartTime).not.toBeNull();
		expect(sunsetEndTime).not.toBeNull();

		if (sunriseStartTime) {
			expect(times.rise.timestamp).toHaveDifference(sunriseStartTime.timestamp, 1000);
		}

		if (sunsetEndTime) {
			expect(times.set.timestamp).toHaveDifference(sunsetEndTime.timestamp, 1000);
		}
	});
	it("getSunTime adjusts sun phases when additionally given the observer\"s elevation", () => {
		const times = getSunTime(DATE, LAT, LNG, 0, { height: HEIGHT });

		expect(HEIGHT_TIMES[2].timestamp).toHaveDifference(times.rise.timestamp, 1000);
		expect(HEIGHT_TIMES[3].timestamp).toHaveDifference(times.set.timestamp, 1000);
	});
});
