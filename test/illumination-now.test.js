import { describe, expect, it } from "vitest";
import { getScheduleState } from "../src/lib/core/get-schedule-state";
import { getTimestamp } from "../src/lib/core/schedule-intervals";
import { currentYear } from "../src/lib/constants";
import { schedule } from "../src/data/data";

const testScheduleCase = (...timestampInput) => (lights) => (...timestamp) => {
	const state = getScheduleState(
		getTimestamp(...timestampInput)
	);
	expect(state).toEqual({
		lights,
		timestamp: getTimestamp(...timestamp)
	});
};

describe("Illumination state at the moment", () => {
	it("Returns the correct schedule data before turning off", () => {
		for (const record of schedule) {
			const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = record;
			for (let date = dateFrom; date <= dateTo; date++) {
				testScheduleCase(currentYear, month, date, hoursOff - 1)(true)(currentYear, month, date, hoursOff, minutesOff);
			}
		}
	});
	it("Returns the correct schedule data after turning off", () => {
		for (const record of schedule) {
			const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = record;
			for (let date = dateFrom; date <= dateTo; date++) {
				testScheduleCase(currentYear, month, date, hoursOff + 1)(false)(currentYear, month, date, hoursOn, minutesOn);
			}
		}
	});
	it("Returns the correct schedule data before turning on", () => {
		for (const record of schedule) {
			const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = record;
			for (let date = dateFrom; date <= dateTo; date++) {
				testScheduleCase(currentYear, month, date, hoursOn - 1)(false)(currentYear, month, date, hoursOn, minutesOn);
			}
		}
	});
	it("Returns the correct schedule data after turning on", () => {
		for (const [ index, record ] of schedule.entries()) {
			const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = record;
			for (let date = dateFrom; date <= dateTo; date++) {
				if (date < dateTo) {
					testScheduleCase(currentYear, month, date, hoursOn + 1)(true)(currentYear, month, date + 1, hoursOff, minutesOff);
				} else {
					const nextEntry = schedule[index + 1];
					if (!nextEntry) {
						continue;
					}

					testScheduleCase(currentYear, month, date, hoursOn + 1)(true)(currentYear, nextEntry[0], nextEntry[1], nextEntry[5], nextEntry[6]);
				}
			}
		}
	});
	it("Returns the correct schedule at the end of the year", () => {
		const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = schedule[schedule.length - 1];
		testScheduleCase(currentYear, 12, 31, 23)(true)(currentYear + 1, 1, 1, hoursOff, minutesOff);
	});
});
