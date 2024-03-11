import { describe, expect, it } from "vitest";
import { scale } from "../src/math";

describe("Project's core math utilities", () => {
	describe("scale", () => {
		it("Returns NaN if any argument is NaN", () => {
			expect(scale(NaN, 0, 1, 10, 100)).toBeNaN();
			expect(scale(0.5, NaN, 1, 10, 100)).toBeNaN();
			expect(scale(0.5, 0, NaN, 10, 100)).toBeNaN();
			expect(scale(0.5, 0, 1, NaN, 100)).toBeNaN();
			expect(scale(0.5, 0, 1, 10, NaN)).toBeNaN();
		});
		it("Returns a value back if is is an Infinity", () => {
			expect(scale(Infinity, 1, 10, 10, 100)).toBe(Infinity);
			expect(scale(-Infinity, 1, 10, 10, 100)).toBe(-Infinity);
		});
		it("Scales the value from one range to another", () => {
			expect(scale(0.5, 0, 1, 0, 100)).toBeCloseTo(50);
			expect(scale(10, 0, 100, 0, 1)).toBeCloseTo(0.1);
			expect(scale(15, 10, 20, -10, -20)).toBeCloseTo(-15);
		});
	});
});
