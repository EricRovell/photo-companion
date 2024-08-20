import { describe, expect, it } from "vitest";

import { fmod, fmod360, fmod90 } from "../src/utils/math";

describe("Math utils", () => {
	it("fmod works for positive values", () => {
		const val = Math.random() * 10;
		expect(fmod(360 + val, 360)).toBeCloseTo(val, 6);
	});
	it("fmod always return positive values, even for negative input values", () => {
		const val = Math.random() * -1;
		expect(fmod(val, 1)).toEqual(val + 1);
		expect(fmod(val, 1)).toBeCloseTo(val + 1, 12);
	});
	it("fmod positive", () => {
		expect(fmod(0, 1)).toEqual(0);
		expect(fmod(0.5, 1)).toEqual(0.5);
		expect(fmod(10000.5, 1)).toEqual(0.5);
		expect(fmod(0.99999, 1)).toEqual(0.99999);
		expect(fmod(0.99999999, 1)).toEqual(0.99999999);
		expect(fmod(0.99999999999, 1)).toEqual(0.99999999999);
		expect(fmod(1, 1)).toEqual(0);
	});
	it("fmod negative", () => {
		expect(fmod(-0, 1)).toEqual(0);
		expect(fmod(-0.5, 1)).toEqual(0.5);
		expect(fmod(-10000.5, 1)).toEqual(0.5);
		expect(fmod(-0.99999, 1)).toBeCloseTo(0.00001, 6);
		expect(fmod(-0.99999999, 1)).toBeCloseTo(0.00000001, 8);
		expect(fmod(-0.99999999999, 1)).toBeCloseTo(0.00000000001, 12);
		expect(fmod(-1, 1)).toEqual(0);
	});
	it("fmod360", () => {
		expect(fmod360(0)).toEqual(0);
		expect(fmod360(360)).toEqual(0);
		expect(fmod360(58)).toEqual(58);
		expect(fmod360(361)).toEqual(1);
		expect(fmod360(-1)).toEqual(359);
		expect(fmod360(-360)).toEqual(0);
		expect(fmod360(-361)).toEqual(359);
	});
	it("fmod90", () => {
		expect(fmod90(0)).toEqual(0);
		expect(fmod90(90)).toEqual(90);
		expect(fmod90(54)).toEqual(54);
		expect(fmod90(91)).toEqual(89);
		expect(fmod90(-1)).toEqual(-1);
		expect(fmod90(-90)).toEqual(-90);
		expect(fmod90(-91)).toEqual(-89);
	});
});
