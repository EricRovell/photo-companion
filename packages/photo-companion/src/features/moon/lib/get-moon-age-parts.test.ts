import { describe, expect, it } from "vitest";

import { getMoonAgeParts } from "./get-moon-age-parts";

describe("getMoonAgeParts", () => {
	it("splits fractional days into days, hours, and minutes", () => {
		const age = ((8 * 24 + 5) * 60 + 12) / (24 * 60);

		expect(getMoonAgeParts(age)).toEqual({
			days: 8,
			hours: 5,
			minutes: 12
		});
	});

	it("rounds the age to the nearest minute", () => {
		const age = ((1 * 24 + 23) * 60 + 59.6) / (24 * 60);

		expect(getMoonAgeParts(age)).toEqual({
			days: 2,
			hours: 0,
			minutes: 0
		});
	});
});
