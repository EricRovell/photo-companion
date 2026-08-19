import { describe, expect, it } from "vitest";

import { getPreviousDate } from "./get-previous-date";

describe("getPreviousDate", () => {
	it("finds the previous day across month and year boundaries", () => {
		expect(getPreviousDate(new Date(2026, 2, 1, 12, 30)))
			.toEqual(new Date(2026, 1, 28, 12, 30));
		expect(getPreviousDate(new Date(2026, 0, 1, 12, 30)))
			.toEqual(new Date(2025, 11, 31, 12, 30));
	});
});
