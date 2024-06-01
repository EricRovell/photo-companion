import { describe, expect, it } from "vitest";

import { initLightsProvider } from "../src";
import { schedule as data } from "../src/schedule/lights-saint-petersburg";
import { getFullYearDaysList } from "./utils";

const { getScheduleByDate, getStateByDate } = initLightsProvider("SAINT_PETERSBURG");

describe("Illumination schedule, Moscow, Russia", () => {
	describe("Data validation", () => {
		it("Has the correct record length", () => {
			// check data README to understand the number of records
			expect(data.schedule.length).toBe(4 * 6 * 12);
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
			const input = new Date(data.year, 0, 5, 7, 30);
			const output = {
				event: "LIGHTS_END",
				lights: true,
				timestamp: new Date(data.year, 0, 5, 9, 50).getTime()
			};

			expect(getStateByDate(input)).toEqual(output);
		});
		it("The time is before the lights start today", () => {
			const input = new Date(data.year, 0, 5, 15, 0);
			const output = {
				event: "LIGHTS_START",
				lights: false,
				timestamp: new Date(data.year, 0, 5, 16, 15).getTime()
			};

			expect(getStateByDate(input)).toEqual(output);
		});
		it("The time is during the lights today, they will turn off the next day", () => {
			const input = new Date(data.year, 0, 5, 18, 0);
			const output = {
				event: "LIGHTS_END",
				lights: true,
				timestamp: new Date(data.year, 0, 6, 9, 45).getTime()
			};

			expect(getStateByDate(input)).toEqual(output);
		});
	});
});
