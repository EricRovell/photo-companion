import { describe, expect, it } from "vitest";

import { getEarthshineProbability } from "./earthshine";

const SAINT_PETERSBURG = {
	latitude: 59.844404,
	longitude: 30.3131
};

describe("getEarthshineProbability", () => {
	it("includes a documented Saint Petersburg earthshine observation", () => {
		// 4 March 2022, 19:25 local time (UTC+3).
		const observationTime = new Date("2022-03-04T16:25:00Z");
		const opportunity = getEarthshineProbability(
			observationTime,
			SAINT_PETERSBURG.latitude,
			SAINT_PETERSBURG.longitude
		);

		expect(opportunity).not.toBeNull();
		expect(opportunity?.waxing).toBe(true);
		expect(opportunity?.peak.illumination).toBeLessThanOrEqual(0.25);
		expect(opportunity?.dateStart.getTime()).toBeLessThanOrEqual(observationTime.getTime());
		expect(opportunity?.dateEnd.getTime()).toBeGreaterThanOrEqual(observationTime.getTime());
	});

	it("finds a morning opportunity before new Moon", () => {
		const opportunity = getEarthshineProbability(
			new Date("2024-01-08T12:00:00Z"),
			SAINT_PETERSBURG.latitude,
			SAINT_PETERSBURG.longitude
		);

		expect(opportunity).not.toBeNull();
		expect(opportunity?.waxing).toBe(false);
	});

	it("returns no opportunity around full Moon", () => {
		const opportunity = getEarthshineProbability(
			new Date("2024-04-23T12:00:00Z"),
			SAINT_PETERSBURG.latitude,
			SAINT_PETERSBURG.longitude
		);

		expect(opportunity).toBeNull();
	});
});
