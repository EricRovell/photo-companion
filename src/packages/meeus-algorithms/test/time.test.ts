import { describe, expect, it } from "vitest";

import { getJulianDay } from "../src/utils/julian-day";
import { getLocalSiderealTime } from "../src/utils/time";

describe("Time", () => {
	it("Julian day provide correct sidereal time", () => {
		// See AA page 88, Example 12.1a
		// Note: month is zero indexed
		const UTCDate = new Date(Date.UTC(1987, 3, 10));
		const jd = getJulianDay(UTCDate);
		expect(getLocalSiderealTime(jd, 0)).toBeCloseTo(13.1795463333, 6);
	});
});
