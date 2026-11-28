import { describe, expect, it } from "vitest";

import { calcDuration, countDays, isLeapYear, isSameDay } from "../src/date";

describe("date utilities", () => {
	describe("calcDuration", () => {
		const at = (hours: number, minutes = 0) => new Date(2023, 10, 24, hours, minutes);

		describe("Some event time is not specified", () => {
			it("Only start time is specified", () => {
				expect(calcDuration(at(21), null)).toBe(3 * 3600 * 1000);
			});

			it("Only end time is specified", () => {
				expect(calcDuration(null, at(18))).toBe(18 * 3600 * 1000);
			});
		});

		describe("Both points are specified", () => {
			it("End event happened later than start", () => {
				expect(calcDuration(at(13), at(14))).toBe(3600 * 1000);
			});

			it("Start event happened later than end", () => {
				expect(calcDuration(at(20), at(4))).toBe(8 * 3600 * 1000);
				expect(calcDuration(at(5, 26), at(8, 33))).toBe(187 * 60 * 1000);
			});
		});
	});

	describe("countDays", () => {
		it("counts the number of days with properly placed dates", () => {
			expect(countDays(
				new Date(2021, 1, 1),
				new Date(2021, 1, 15)
			)).toBe(14);
			expect(countDays(
				new Date(2021, 0, 1),
				new Date(2021, 1, 27)
			)).toBe(57);
		});

		it("counts the number of days with dates in wrong order", () => {
			expect(countDays(
				new Date(2021, 1, 15),
				new Date(2021, 1, 1)
			)).toBe(14);
			expect(countDays(
				new Date(2021, 1, 27),
				new Date(2021, 0, 1)
			)).toBe(57);
		});

		it("Ceils the result", () => {
			expect(countDays(
				new Date(2021, 1, 1, 12),
				new Date(2021, 1, 15)
			)).toBe(14);
			expect(countDays(
				new Date(2021, 0, 1, 23),
				new Date(2021, 1, 27)
			)).toBe(57);
		});
	});

	describe("isLeapYear", () => {
		it("Checks if the given date is a leap year", () => {
			expect(isLeapYear(2024)).toBe(true);
			expect(isLeapYear(2023)).toBe(false);
			expect(isLeapYear(1900)).toBe(false);
		});
	});

	describe("isSameDay", () => {
		it("checks two dates for the same day", () => {
			const a = new Date(2021, 0, 1, 12, 40);
			const b = new Date(2021, 0, 1, 23, 40);
			const c = new Date(2021, 0, 2, 2, 40);
	
			expect(isSameDay(a, b)).toBe(true);
			expect(isSameDay(b, a)).toBe(true);
			expect(isSameDay(a, c)).toBe(false);
			expect(isSameDay(c, a)).toBe(false);
			expect(isSameDay(b, c)).toBe(false);
			expect(isSameDay(c, b)).toBe(false);
		});
	});
});
