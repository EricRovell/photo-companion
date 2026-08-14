import { describe, expect, it } from "vitest";

import type { Model } from "../height-by-shadow.context";

import { validate } from ".";

const VALID_MODEL: Model = {
	date: new Date("2025-01-01T00:00:00Z"),
	latitude: [ 51, 30, 0 ],
	latitude_direction: "N",
	length_shadow: 5,
	level_object: 0,
	level_shadow: 0,
	longitude: [ 0, 6, 0 ],
	longitude_direction: "W",
	solar_azimuth_angle: 180
};

describe("height-by-shadow validation", () => {
	it("validates longitude independently from latitude", () => {
		expect(validate(VALID_MODEL).longitude).toBe(false);
		expect(validate({ ...VALID_MODEL, longitude: [ 181, 0, 0 ] }).longitude).toBe(true);
	});
});
