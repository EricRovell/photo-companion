import { describe, expect, it } from "vitest";
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
import {
	getSunPosition,
	getSunTime,
	getSunTimes
} from "../src";

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

		expect(position.azimuth).toBeCloseTo(0.6412750628729547, 10);
		expect(position.altitude).toBeCloseTo(-0.7000406838781611, 10);
		expect(position.azimuthDegrees).toBeCloseTo(36.742354609606814, 10);
		expect(position.altitudeDegrees).toBeCloseTo(-40.10937667367048, 10);
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

		expect(position.azimuth).toBeCloseTo(0.9416994558253937, 2);
		expect(position.altitude).toBeCloseTo(0.8642295669265889, 2);
		expect(position.azimuthDegrees).toBeCloseTo(54.13110438856136, 1);
		expect(position.altitudeDegrees).toBeCloseTo(49.30800671531246, 1);
	});
	it("getTimes returns sun phases for the given date and location", () => {
		const times = getSunTimes(DATE, LAT, LNG);

		for (const { event, dateString } of TIMES_NORTH_HEMISPHERE) {
			expect(new Date(dateString).toUTCString()).toBe(times[event].value.toUTCString());
		}
	});
	it("getTimes returns sun phases for the given date and location in Southern hemosphere", () => {
		const times = getSunTimes(DATE, LAT_SOUTHERN_HEMISPHERE, LNG_SOUTHERN_HEMISPHERE);

		for (const { event, dateString } of TIMES_SOUTH_HEMISPHERE) {
			expect(new Date(dateString).toUTCString()).toBe(times[event].value.toUTCString());
		}
	});
	it("getTimes adjusts sun phases when additionally given the observer height", () => {
		const times = getSunTimes(DATE, LAT, LNG, HEIGHT);

		for (const { event, dateString } of HEIGHT_TIMES) {
			expect(new Date(dateString).toUTCString()).toBe(times[event].value.toUTCString());
		}
	});
	it("getSunTime returns the correct time for the given date and location", () => {
		const times = getSunTime(DATE, LAT, LNG, 0);

		const sunriseStartTime = TIMES_NORTH_HEMISPHERE.find(({ event }) => event === "sunrise:start");
		const sunsetEndTime = TIMES_NORTH_HEMISPHERE.find(({ event }) => event === "sunset:end");

		expect(new Date(times.rise.value).toUTCString()).toBe(new Date(sunriseStartTime.dateString).toUTCString());
		expect(new Date(times.set.value).toUTCString()).toBe(new Date(sunsetEndTime.dateString).toUTCString());
	});
	it("getSunTime adjusts sun phases when additionally given the observer\"s elevation", () => {
		const times = getSunTime(DATE, LAT, LNG, 0, HEIGHT);

		expect(new Date(HEIGHT_TIMES[2].dateString).toUTCString()).toBe(new Date(times.rise.value).toUTCString());
		expect(new Date(HEIGHT_TIMES[3].dateString).toUTCString()).toBe(new Date(times.set.value).toUTCString());
	});
});
