import { isLeapYear } from "utils/date";
import { describe, expect, it } from "vitest";

import { initLightsProvider } from "../src";
import { schedule as data } from "../src/schedule/lights-moscow";
import { getFullYearDaysList } from "./utils";

const { getScheduleByDate, getStateByDate } = initLightsProvider("MOSCOW");

describe("Illumination schedule, Moscow, Russia", () => {
	describe("Data validation", () => {
		it("Has the correct record length", () => {
			// check data README to understand the number of records
			const days = isLeapYear(data.year) ? 366 : 365;
			expect(data.schedule.length).toBe(4 * days);
		});
		it("Has the correct types", () => {
			for (const record of data.schedule) {
				expect(Number.isInteger(record)).toBe(true);
			}
		});
		it("Has the correct hours values", () => {
			for (let i = 0; i < data.schedule.length; i += 2) {
				expect(data.schedule[i]).toBeGreaterThanOrEqual(0);
				expect(data.schedule[i]).toBeLessThanOrEqual(23);
				expect(data.schedule[i]).toBeGreaterThanOrEqual(0);
				expect(data.schedule[i]).toBeLessThanOrEqual(23);
			}
		});
		it("Has the correct minutes values", () => {
			for (let i = 1; i < data.schedule.length; i += 2) {
				expect(data.schedule[i]).toBeGreaterThanOrEqual(0);
				expect(data.schedule[i]).toBeLessThanOrEqual(59);
				expect(data.schedule[i]).toBeGreaterThanOrEqual(0);
				expect(data.schedule[i]).toBeLessThanOrEqual(59);
			}
		});
	});
	describe("schedule retrievement", () => {
		it("Retrieves the right schedule for each date", () => {
			const fullYearDateList = getFullYearDaysList(data.year);

			for (let i = 0; i < fullYearDateList.length; i++) {
				const date = fullYearDateList[i];
				const index = data.getter(date);

				const hoursOn = data.schedule[index];
				const minutesOn = data.schedule[index + 1];
				const hoursOff = data.schedule[index + 2];
				const minutesOff = data.schedule[index + 3];

				const output = getScheduleByDate(date);
				const start = new Date(output.LIGHTS_START);
				const end = new Date(output.LIGHTS_END);

				expect(start.getHours()).toBe(hoursOn);
				expect(start.getMinutes()).toBe(minutesOn);
				expect(end.getHours()).toBe(hoursOff);
				expect(end.getMinutes()).toBe(minutesOff);
			}
		});
	});
	describe("Nearest illumination event", () => {
		it("The time is before the lights end today", () => {
			const input = new Date(data.year, 0, 2, 7, 30);
			const output = {
				event: "LIGHTS_END",
				lights: true,
				timestamp: new Date(data.year, 0, 2, 8, 36).getTime()
			};

			expect(getStateByDate(input)).toEqual(output);
		});
		it("The time is before the lights start today", () => {
			const input = new Date(data.year, 0, 2, 15, 0);
			const output = {
				event: "LIGHTS_START",
				lights: false,
				timestamp: new Date(data.year, 0, 2, 16, 19).getTime()
			};

			expect(getStateByDate(input)).toEqual(output);
		});
		it("The time is during the lights today, they will turn off the next day", () => {
			const input = new Date(data.year, 0, 2, 18, 0);
			const output = {
				event: "LIGHTS_END",
				lights: true,
				timestamp: new Date(data.year, 0, 3, 8, 35).getTime()
			};

			expect(getStateByDate(input)).toEqual(output);
		});
	});
});
