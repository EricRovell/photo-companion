import { describe, expect, it } from "vitest";

import { getDecimalValue } from "../src/utils/sexagesimal";
import { isPositive } from "../src/utils/validators";

describe("sexagesimal", () => {
	it("get decimal values for positive numbers", () => {
		expect(isPositive(getDecimalValue(12, 24, 45))).toBeTruthy();
	});
	it("get decimal values for negative numbers", () => {
		expect(isPositive(getDecimalValue(-9, 24, 45))).toBeFalsy();
	});
	it("get decimal values for positive radix even with negative min or sec", () => {
		expect(isPositive(getDecimalValue(12, -24, -45))).toBeTruthy();
		expect(getDecimalValue(12, -24, -45)).toEqual(getDecimalValue(12, 24, 45));
	});
	it("get decimal values for negative radix even with negative min or sec", () => {
		expect(isPositive(getDecimalValue(-9, -24, -45))).toBeFalsy();
		expect(getDecimalValue(-9, -24, -45)).toEqual(getDecimalValue(-9, 24, 45));
		expect(getDecimalValue(-9, -24, -45)).toEqual(getDecimalValue(-9, 24, -45));
	});
});
