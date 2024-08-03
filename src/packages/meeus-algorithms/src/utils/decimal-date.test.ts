import { describe, expect, it } from "vitest";

import { calcDecimalDate, getTimeFromDecimalDate } from "./decimal-date";

describe("Decimal date time calculations", () => {
	it("Calculates time from a decimal date", () => {
		expect(getTimeFromDecimalDate(12.5)).toEqual([ 12, 0, 0 ]);
		expect(getTimeFromDecimalDate(0)).toEqual([ 0, 0, 0 ]);
		expect(getTimeFromDecimalDate(4.81)).toEqual([ 19, 26, 24 ]);
	});
	it("Calculates the decimal date", () => {
		expect(calcDecimalDate(12, 0, 0)).toBe(0.5);
		expect(calcDecimalDate(0, 0, 0)).toBe(0);
		expect(calcDecimalDate(19, 26, 24)).toBe(0.81);
	});
});
