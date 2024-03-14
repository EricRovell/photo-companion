import { describe, expect, it } from "vitest";
import { round, scale } from "../src/math";

describe("Project's core math utilities", () => {
	describe("round", () => {
		it("Returns NaN if any argument is NaN", () => {
			expect(round(1.12345, 3, NaN)).toBeNaN();
			expect(round(1.12345, NaN)).toBeNaN();
			expect(round(NaN, 3)).toBeNaN();
		});
		it("Returns NaN if the number of digits are infinite", () => {
			expect(round(1.256, Infinity)).toBeNaN();
			expect(round(1.256, -Infinity)).toBeNaN();
		});
		it("Returns a value back if is is an Infinity", () => {
			expect(round(Infinity, 3)).toBe(Infinity);
			expect(round(-Infinity, 3)).toBe(-Infinity);
		});
		it("Rounds the positive values with no arguments to the closest integer", () => {
			expect(round(1.123)).toBe(1);
			expect(round(1.789)).toBe(2);
			expect(round(0.5)).toBe(1);
			expect(round(0.49)).toBe(0);
		});
		it("Rounds the negative values with no arguments to the closest integer", () => {
			expect(round(-1.123)).toBe(-1);
			expect(round(-1.789)).toBe(-2);
			expect(round(-1.51)).toBe(-2);
			expect(round(-1.49)).toBe(-1);
		});
		it("Rounds the positive values up till specified digits", () => {
			expect(round(1.12345, 1)).toBe(1.1);
			expect(round(1.12345, 2)).toBe(1.12);
			expect(round(1.12345, 3)).toBe(1.123);
			expect(round(1.12345, 4)).toBe(1.1235);
			expect(round(1.12345, 5)).toBe(1.12345);
			expect(round(1.12345, 6)).toBe(1.12345);
		});
		it("Rounds the negative values up till specified digits", () => {
			expect(round(-1.12345, 1)).toBe(-1.1);
			expect(round(-1.12345, 2)).toBe(-1.12);
			expect(round(-1.12345, 3)).toBe(-1.123);
			expect(round(-1.12345, 4)).toBe(-1.1234);
			expect(round(-1.12345, 5)).toBe(-1.12345);
			expect(round(-1.12345, 6)).toBe(-1.12345);
		});
		it("Zero do not get the sign", () => {
			expect(round(-0.49)).toBe(0);
			expect(round(0.49)).toBe(0);
		});
	});
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
