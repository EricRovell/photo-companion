import { describe, expect, it } from "vitest";

import { getJulianDay } from "../src/utils/julian-day";

describe("julian days", () => {
	it("Builds julian day with date", () => {
		const UTCDate = new Date(Date.UTC(2016, 8, 17));
		expect(getJulianDay(UTCDate)).toBe(2457648.5);
	});
	it("Builds julian day with no argument", () => {
		expect(getJulianDay()).toBeGreaterThan(2457648.5);
	});
	/* it("Calculates the Julian Century", () => {
		expect(getJulianCentury(427)).toBe(300);
	}); */
});
