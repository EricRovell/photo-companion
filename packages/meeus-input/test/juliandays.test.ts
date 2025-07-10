import { describe, expect, test } from "vitest";

import { getApparentLocalSiderealTime, getDate, getJulianDay, getJulianDayMidnight, getLocalSiderealTime } from "../src/juliandays";
import { getDecimalValue } from "../src/sexagesimal";

describe("julian days", () => {
	test("build julianday with date", () => {
		const UTCDate = new Date(Date.UTC(2016, 8, 17));
		expect(getJulianDay(UTCDate)).toBe(2457648.5);
	});

	test("build julianday with nothing", () => {
		expect(getJulianDay()).toBeGreaterThan(2457648.5);
	});

	test("julianday provide correct sidereal time", () => {
		// See AA page 88, Example 12.1a. APRIL = Month 3, not 4!
		const UTCDate = new Date(Date.UTC(1987, 3, 10));
		expect(getLocalSiderealTime(getJulianDay(UTCDate), 0)).toBeCloseTo(13.1795463333, 6);
	});

	test("julianday getJulianDayMidnight is really 0h UTC", () => {
		const UTCDate = new Date(Date.UTC(1987, 3, 10, 11, 43, 12, 890));
		const jd = getJulianDay(UTCDate);
		const jd0 = getJulianDayMidnight(jd);
		const midnightUTCDate = getDate(jd0);
		expect(midnightUTCDate.getUTCHours()).toEqual(0);
		expect(midnightUTCDate.getUTCMinutes()).toEqual(0);
		expect(midnightUTCDate.getUTCSeconds()).toEqual(0);
	});

	// See AA p 88
	test("mean sidereal time at Greenwich", () => {
		// April 10th, 1987, 0h UT.
		const UTCDate = new Date(Date.UTC(1987, 3, 10, 0, 0, 0));
		const jd = getJulianDay(UTCDate);
		expect(getLocalSiderealTime(jd, 0)).toBeCloseTo(getDecimalValue(13, 10, 46.3668), 7);
	});

	// See AA p 88
	test("apparent sidereal time at Greenwich", () => {
		// April 10th, 1987, 0h UT.
		const UTCDate = new Date(Date.UTC(1987, 3, 10, 0, 0, 0));
		const jd = getJulianDay(UTCDate);
		expect(getApparentLocalSiderealTime(jd, 0)).toBeCloseTo(getDecimalValue(13, 10, 46.1351), 1);
	});
});
