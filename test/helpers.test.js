import { describe, expect, it } from "vitest";
import { calcEventDuration } from "@lib/helpers";

describe("Calculate the event duration for a given day", () => {
	const testFn = (...a) => (...b) => (c) => {
		const start = a.length ? new Date(2023, 10, 24, ...a) : null;
		const end = b.length ? new Date(2023, 10, 24, ...b) : null;
		expect(calcEventDuration(start, end)).toBe(c);
	};

	describe("Some event time is not specified", () => {
		it("Only start time is specified", () => {
			testFn(21, 0)()(3 * 3600);
		});
		it("Only end time is specified", () => {
			testFn()(18, 0)(18 * 3600);
		});
	});
	describe("Both points are specified", () => {
		it("End event happened later than start", () => {
			testFn(13, 0)(14, 0)(3600);
		});
		it("Start event happened later than end", () => {
			testFn(20, 0)(4, 0)(8 * 3600);
		});
	});
});
