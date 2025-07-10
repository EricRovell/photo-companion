import { describe, expect, it } from "vitest";

import * as sexagesimal from "../src/sexagesimal";
import { isPositive } from "../src/utils";

describe("sexagesimal", () => {
	it("get decimal values for positive numbers", () => {
		expect(isPositive(sexagesimal.getDecimalValue(12, 24, 45))).toBeTruthy();
	});

	it("get decimal values for negativ numbers", () => {
		expect(isPositive(sexagesimal.getDecimalValue(-9, 24, 45))).toBeFalsy();
	});

	it("get decimal values for positive radix even with negative min or sec", () => {
		expect(isPositive(sexagesimal.getDecimalValue(12, -24, -45))).toBeTruthy();
		expect(sexagesimal.getDecimalValue(12, -24, -45)).toEqual(sexagesimal.getDecimalValue(12, 24, 45));
	});

	it("get decimal values for negative radix even with negative min or sec", () => {
		expect(isPositive(sexagesimal.getDecimalValue(-9, -24, -45))).toBeFalsy();
		expect(sexagesimal.getDecimalValue(-9, -24, -45)).toEqual(sexagesimal.getDecimalValue(-9, 24, 45));
		expect(sexagesimal.getDecimalValue(-9, -24, -45)).toEqual(sexagesimal.getDecimalValue(-9, 24, -45));
	});
});
