import { describe, expect, it } from "vitest";
import { schedule } from "../src/data/data";

const dates = {
	"1": 31,
	"2": 29,
	"3": 31,
	"4": 30,
	"5": 31,
	"6": 30,
	"7": 31,
	"8": 31,
	"9": 30,
	"10": 31,
	"11": 30,
	"12": 31
};

describe("Schedule data validation", () => {
	it("Has the correct record length", () => {
		for (const record of schedule) {
			expect(record.length).toBe(7);
		}
	});
	it("Has the correct types", () => {
		for (const record of schedule) {
			expect(record.every(item => Number.isInteger(item))).toBe(true);
		}
	});
	it("Has the correct month value", () => {
		for (const record of schedule) {
			expect(record[0]).toBeGreaterThanOrEqual(1);
			expect(record[0]).toBeLessThanOrEqual(12);
		}
	});
	it("Has the correct date values", () => {
		for (const record of schedule) {
			expect(record[1]).toBeGreaterThanOrEqual(1);
			expect(record[1]).toBeLessThanOrEqual(dates[record[0]]);
			expect(record[2]).toBeGreaterThanOrEqual(1);
			expect(record[2]).toBeLessThanOrEqual(dates[record[0]]);
		}
	});
	it("Has the correct hours values", () => {
		for (const record of schedule) {
			expect(record[3]).toBeGreaterThanOrEqual(0);
			expect(record[5]).toBeLessThanOrEqual(23);
			expect(record[3]).toBeGreaterThanOrEqual(0);
			expect(record[5]).toBeLessThanOrEqual(23);
		}
	});
	it("Has the correct minutes values", () => {
		for (const record of schedule) {
			expect(record[4]).toBeGreaterThanOrEqual(0);
			expect(record[6]).toBeLessThanOrEqual(59);
			expect(record[4]).toBeGreaterThanOrEqual(0);
			expect(record[6]).toBeLessThanOrEqual(59);
		}
	});
});
