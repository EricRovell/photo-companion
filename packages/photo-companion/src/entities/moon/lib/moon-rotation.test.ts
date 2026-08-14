import { getMoonIllumination, getMoonPosition, getMoonZenithAngle } from "moon-sun-calc";
import { describe, expect, it } from "vitest";

import { getMoonRotation } from "./moon-rotation";

describe("getMoonRotation", () => {
	it("accounts for the phase shape's waxing axis", () => {
		expect(getMoonRotation(-90, true)).toBe(0);
	});

	it("accounts for the phase shape's waning axis", () => {
		expect(getMoonRotation(90, false)).toBe(0);
	});

	it("matches the Saint Petersburg comparison case", () => {
		const date = new Date("2026-07-26T08:08:00.000Z");
		const illumination = getMoonIllumination(date);
		const position = getMoonPosition({
			instant: date,
			observer: { latitude: 59.844404, longitude: 30.3131 }
		});
		const zenithAngle = getMoonZenithAngle(illumination.angle, position.parallacticAngle);

		expect(getMoonRotation(zenithAngle, illumination.waxing)).toBeCloseTo(-3.8483, 3);
	});
});
