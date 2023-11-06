import { describe, expect, it } from "vitest";
import { getLightsScheduleByDateSPb, getLightsStateByDateSpb } from "../src/services/lights/illumination-spb";
import data from "../src/data/lights-spb.json" assert { type: "json" };

const fixtures = [
	[ 1, 1, 5, 16, 15, 9, 50 ],
	[ 1, 6, 10, 16, 25, 9, 45 ],
	[ 1, 11, 15, 16, 35, 9, 40 ],
	[ 1, 16, 20, 16, 45, 9, 30 ],
	[ 1, 21, 25, 17, 0, 9, 20 ],
	[ 1, 26, 31, 17, 10, 9, 10 ],
	[ 2, 1, 5, 17, 25, 9, 0 ],
	[ 2, 6, 10, 17, 40, 8, 50 ],
	[ 2, 11, 15, 17, 50, 8, 35 ],
	[ 2, 16, 20, 18, 5, 8, 20 ],
	[ 2, 21, 25, 18, 15, 8, 10 ],
	[ 2, 26, 28, 18, 25, 8, 0 ],
	[ 3, 1, 5, 18, 40, 7, 45 ],
	[ 3, 6, 10, 18, 50, 7, 30 ],
	[ 3, 11, 15, 19, 5, 7, 15 ],
	[ 3, 16, 20, 19, 15, 7, 0 ],
	[ 3, 21, 25, 19, 30, 6, 30 ],
	[ 3, 26, 31, 19, 40, 6, 10 ],
	[ 4, 1, 5, 20, 5, 5, 50 ],
	[ 4, 6, 10, 20, 25, 5, 35 ],
	[ 4, 11, 15, 20, 35, 5, 20 ],
	[ 4, 16, 20, 20, 50, 5, 5 ],
	[ 4, 21, 25, 21, 5, 4, 50 ],
	[ 4, 26, 30, 21, 20, 4, 30 ],
	[ 5, 1, 5, 21, 30, 4, 15 ],
	[ 5, 6, 10, 21, 50, 4, 0 ],
	[ 5, 11, 15, 22, 0, 3, 45 ],
	[ 5, 16, 20, 22, 15, 3, 30 ],
	[ 5, 21, 25, 22, 30, 3, 15 ],
	[ 5, 26, 31, 22, 45, 3, 0 ],
	[ 6, 1, 5, 23, 0, 2, 45 ],
	[ 6, 6, 10, 23, 5, 2, 35 ],
	[ 6, 11, 15, 23, 15, 2, 30 ],
	[ 6, 16, 20, 23, 15, 2, 30 ],
	[ 6, 21, 25, 23, 15, 2, 35 ],
	[ 6, 26, 30, 23, 15, 2, 40 ],
	[ 7, 1, 5, 23, 10, 2, 50 ],
	[ 7, 6, 10, 23, 0, 2, 55 ],
	[ 7, 11, 15, 22, 50, 3, 10 ],
	[ 7, 16, 20, 22, 40, 3, 20 ],
	[ 7, 21, 25, 22, 25, 3, 35 ],
	[ 7, 26, 31, 22, 10, 3, 55 ],
	[ 8, 1, 5, 21, 55, 4, 10 ],
	[ 8, 6, 10, 21, 40, 4, 25 ],
	[ 8, 11, 15, 21, 20, 4, 40 ],
	[ 8, 16, 20, 21, 5, 4, 55 ],
	[ 8, 21, 25, 20, 50, 5, 5 ],
	[ 8, 26, 31, 20, 30, 5, 20 ],
	[ 9, 1, 5, 20, 15, 5, 35 ],
	[ 9, 6, 10, 20, 0, 5, 45 ],
	[ 9, 11, 15, 19, 45, 6, 0 ],
	[ 9, 16, 20, 19, 30, 6, 10 ],
	[ 9, 21, 25, 19, 15, 6, 25 ],
	[ 9, 26, 30, 19, 0, 6, 40 ],
	[ 10, 1, 5, 18, 30, 7, 0 ],
	[ 10, 6, 10, 18, 10, 7, 20 ],
	[ 10, 11, 15, 17, 50, 7, 35 ],
	[ 10, 16, 20, 17, 35, 7, 45 ],
	[ 10, 21, 25, 17, 25, 8, 0 ],
	[ 10, 26, 31, 17, 10, 8, 10 ],
	[ 11, 1, 5, 16, 55, 8, 25 ],
	[ 11, 6, 10, 16, 45, 8, 40 ],
	[ 11, 11, 15, 16, 35, 8, 50 ],
	[ 11, 16, 20, 16, 20, 9, 0 ],
	[ 11, 21, 25, 16, 15, 9, 10 ],
	[ 11, 26, 30, 16, 10, 9, 20 ],
	[ 12, 1, 5, 16, 0, 9, 30 ],
	[ 12, 6, 10, 16, 0, 9, 40 ],
	[ 12, 11, 15, 16, 0, 9, 40 ],
	[ 12, 16, 20, 16, 0, 9, 50 ],
	[ 12, 21, 25, 16, 0, 9, 50 ],
	[ 12, 26, 31, 16, 1, 9, 50 ]
];

const testFn = (month, date) => (...output) => {
	const schedule = getLightsScheduleByDateSPb(new Date(2023, month - 1, date));
	const dateStart = new Date(schedule["lights:start"]);
	const dateEnd = new Date(schedule["lights:end"]);

	expect([
		dateStart.getHours(),
		dateStart.getMinutes(),
		dateEnd.getHours(),
		dateEnd.getMinutes()
	]).toEqual(output);
};

describe("Illumination schedule, Saint-Petersburg, Russia", () => {
	describe("Data validation", () => {
		it("Has the correct record length", () => {
			// check data README to understand the number of records
			expect(data.length).toBe(4 * 6 * 12);
		});
		it("Has the correct types", () => {
			for (const record of data) {
				expect(Number.isInteger(record)).toBe(true);
			}
		});
		it("Has the correct hours values", () => {
			for (let i = 0; i < data.length; i += 2) {
				expect(data[i]).toBeGreaterThanOrEqual(0);
				expect(data[i]).toBeLessThanOrEqual(23);
				expect(data[i]).toBeGreaterThanOrEqual(0);
				expect(data[i]).toBeLessThanOrEqual(23);
			}
		});
		it("Has the correct minutes values", () => {
			for (let i = 1; i < data.length; i += 2) {
				expect(data[i]).toBeGreaterThanOrEqual(0);
				expect(data[i]).toBeLessThanOrEqual(59);
				expect(data[i]).toBeGreaterThanOrEqual(0);
				expect(data[i]).toBeLessThanOrEqual(59);
			}
		});
	});
	describe("Shedule retrievement", () => {
		it("Retrieves the right schedule for each date", () => {
			for (const [ month, dateFrom, dateTo, h1, m1, h2, m2 ] of fixtures) {
				for (let date = dateFrom; date <= dateTo; date++) {
					testFn(month, date)(h1, m1, h2, m2);
				}
			}
		});
	});
	describe("Nearest illumination event", () => {
		it("The time is before the lights end today", () => {
			const state = getLightsStateByDateSpb(new Date(2023, 7, 31, 4, 15));
			expect(state).toEqual({
				lights: true,
				event: "lights:end",
				timestamp: new Date(2023, 7, 31, 5, 20).getTime()
			});
		});
		it("The time is before the lights start today", () => {
			const state = getLightsStateByDateSpb(new Date(2023, 7, 31, 10, 20));
			expect(state).toEqual({
				lights: false,
				event: "lights:start",
				timestamp: new Date(2023, 7, 31, 20, 30).getTime()
			});
		});
		it("The time is during the lights today, they will turn off the next day", () => {
			const state = getLightsStateByDateSpb(new Date(2023, 7, 31, 21, 20));
			expect(state).toEqual({
				lights: true,
				event: "lights:end",
				timestamp: new Date(2023, 8, 1, 5, 35).getTime()
			});
		});
	});
});
