import { describe, expect, it } from "vitest";

import {
	isInteger,
	isLatitude,
	isLongitude,
	isNonEmptyString,
	isNonNegativeInteger,
	isNonNullable,
	isNullable,
	isValidDate
} from "../src/validators";

describe("validators utilities", () => {
	describe("isInteger", () => {
		it("checks the value for an integer", () => {
			expect(isInteger(-1)).toBe(true);
			expect(isInteger(0)).toBe(true);
			expect(isInteger(1)).toBe(true);
			expect(isInteger(0.01)).toBe(false);
			expect(isInteger(-0.01)).toBe(false);
			expect(isInteger(0.000001)).toBe(false);
			expect(isInteger(1.0001)).toBe(false);
		});
		it("does pass values considered as an integer", () => {
			expect(isInteger(-1.000)).toBe(true);
			expect(isInteger(5.000)).toBe(true);
		});
		it("does not pass NaN value as an integer", () => {
			expect(isInteger(NaN)).toBe(false);
		});
		it("does not pass infinite values as an integer", () => {
			expect(isInteger(Infinity)).toBe(false);
			expect(isInteger(-Infinity)).toBe(false);
		});
		it("does not pass unsafe integer values as an integer", () => {
			expect(isInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
			expect(isInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false);
		});
	});
	describe("isLatitude", () => {
		it("checks the value if it is a valid latitude", () => {
			expect(isLatitude(90)).toBe(true);
			expect(isLatitude(-90)).toBe(true);
			expect(isLatitude(0)).toBe(true);
			expect(isLatitude(-90.1)).toBe(false);
			expect(isLatitude(90.1)).toBe(false);
			expect(isLatitude(NaN)).toBe(false);
			expect(isLatitude(Infinity)).toBe(false);
			expect(isLatitude(-Infinity)).toBe(false);
		});
	});
	describe("isLongitude", () => {
		it("checks the value if it is a valid latitude", () => {
			expect(isLongitude(180)).toBe(true);
			expect(isLongitude(-180)).toBe(true);
			expect(isLongitude(0)).toBe(true);
			expect(isLongitude(-180.1)).toBe(false);
			expect(isLongitude(180.1)).toBe(false);
			expect(isLongitude(NaN)).toBe(false);
			expect(isLongitude(Infinity)).toBe(false);
			expect(isLongitude(-Infinity)).toBe(false);
		});
	});
	describe("isNonNegativeInteger", () => {
		it("checks the value for a non-negative integer", () => {
			expect(isNonNegativeInteger(1)).toBe(true);
			expect(isNonNegativeInteger(0)).toBe(true);
			expect(isNonNegativeInteger(-1)).toBe(false);
			expect(isNonNegativeInteger(0.01)).toBe(false);
			expect(isNonNegativeInteger(-0.01)).toBe(false);
			expect(isNonNegativeInteger(0.000001)).toBe(false);
			expect(isNonNegativeInteger(1.0001)).toBe(false);
		});
		it("does pass values considered as an integer", () => {
			expect(isNonNegativeInteger(-1.000)).toBe(false);
			expect(isNonNegativeInteger(5.000)).toBe(true);
		});
		it("does not pass NaN value as an integer", () => {
			expect(isNonNegativeInteger(NaN)).toBe(false);
		});
		it("does not pass infinite values as an integer", () => {
			expect(isNonNegativeInteger(Infinity)).toBe(false);
			expect(isNonNegativeInteger(-Infinity)).toBe(false);
		});
		it("does not pass unsafe integer values as an integer", () => {
			expect(isNonNegativeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
			expect(isNonNegativeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false);
		});
	});
	describe("isNonEmptyString", () => {
		it("Passes on a valid not empty string", () => {
			expect(isNonEmptyString("123")).toBe(true);
			expect(isNonEmptyString("Hello world!")).toBe(true);
		});
		it("Does not pass on a valid not empty string", () => {
			expect(isNonEmptyString(null)).toBe(false);
			expect(isNonEmptyString(false)).toBe(false);
			expect(isNonEmptyString(NaN)).toBe(false);
			expect(isNonEmptyString("")).toBe(false);
		});
	});
	describe("isNullable", () => {
		it("checks is the value is nullable", () => {
			expect(isNullable(null)).toBe(true);
			expect(isNullable(undefined)).toBe(true);
			expect(isNullable(1)).toBe(false);
			expect(isNullable("test")).toBe(false);
			expect(isNullable(true)).toBe(false);
		});
		it("does not pass other falsy values as nullable", () => {
			expect(isNullable(false)).toBe(false);
			expect(isNullable("")).toBe(false);
			expect(isNullable(0)).toBe(false);
		});
	});
	describe("isNoNNullable", () => {
		it("checks is the value is not nullable", () => {
			expect(isNonNullable(null)).toBe(false);
			expect(isNonNullable(undefined)).toBe(false);
			expect(isNonNullable(1)).toBe(true);
			expect(isNonNullable("test")).toBe(true);
			expect(isNonNullable(true)).toBe(true);
			expect(isNonNullable(false)).toBe(true);
			expect(isNonNullable("")).toBe(true);
			expect(isNonNullable(0)).toBe(true);
		});
	});
	describe("isValidDate", () => {
		it("checks if the given date value is a valid date", () => {
			expect(isValidDate(new Date())).toBe(true);
			expect(isValidDate(new Date(2021))).toBe(true);
			expect(isValidDate(new Date("1A23"))).toBe(false);
			expect(isValidDate(new Date(""))).toBe(false);
		});
		it("checks if the given timestamp value is a valid date", () => {
			expect(isValidDate(Date.now())).toBe(true);
			expect(isValidDate(new Date(2021).getTime())).toBe(true);
			expect(isValidDate(new Date(NaN))).toBe(false);
			expect(isValidDate(new Date(Infinity))).toBe(false);
			expect(isValidDate(new Date(-Infinity))).toBe(false);
		});
	});
});
