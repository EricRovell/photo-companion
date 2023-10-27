import { describe, expect, it } from "vitest";
import { getScheduleStateByDate, getTimestamp } from "../src/lib/services/schedule";
import { schedule } from "../src/data/data";
import { currentYear } from "../src/lib/constants";

const testScheduleCase = (...timestampInput) => (...timestampOutputOn) => (...timestampOutputOff) => {
	const timestamp = getTimestamp(...timestampInput);
	const state = getScheduleStateByDate(timestamp);
	expect(state).toEqual({
		timestampOn: getTimestamp(...timestampOutputOn),
		timestampOff: getTimestamp(...timestampOutputOff)
	});
};

describe("Illumination state at the moment", () => {
	it("Returns the correct schedule data by given date", () => {
		for (const record of schedule) {
			const [ month, dateFrom, dateTo, hoursOn, minutesOn, hoursOff, minutesOff ] = record;
			for (let date = dateFrom; date <= dateTo; date++) {
				testScheduleCase(currentYear, month, date)(currentYear, month, date, hoursOn, minutesOn)(currentYear, month, date, hoursOff, minutesOff);
			}
		}
	});
});
