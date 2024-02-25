import { describe, expect, it } from "vitest";
import {
	DATE,
	LAT,
	LNG
} from "./fixtures";
import {
	getMoonIllumination,
	getMoonPosition,
	getMoonTimes
} from "../src";

describe("Moon", () => {
	it("getMoonPosition returns moon position data given time and location", () => {
		const position = getMoonPosition(DATE, LAT, LNG);

		expect(position.azimuth).toBeCloseTo(2.1631927013459706, 8);
		expect(position.altitude).toBeCloseTo(0.014551482243892251, 8);
		expect(position.distance).toBeCloseTo(364121.37256256194, 8);
	});
	it("getMoonIllumination returns fraction and angle of moon\"s illuminated limb and phase", () => {
		const illumination = getMoonIllumination(DATE);

		expect(illumination.fraction).toBeCloseTo(0.4848068202456373, 8);
		expect(illumination.phaseValue).toBeCloseTo(0.7548368838538762, 8);
		expect(illumination.angle).toBeCloseTo(1.6732942678578346, 8);
	});
	it("getMoonTimes returns moon rise and set times", () => {
		const times = getMoonTimes(new Date("2013-03-04UTC"), LAT, LNG, true);

		expect(times.rise).not.toBeNull();
		expect(times.set).not.toBeNull();
		expect(times.rise?.toUTCString()).toBe("Mon, 04 Mar 2013 23:54:29 GMT");
		expect(times.set?.toUTCString()).toBe("Mon, 04 Mar 2013 07:47:58 GMT");
	});
});
