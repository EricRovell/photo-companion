import { describe, expect, it } from "vitest";

import { fromJulianDay, getMJD, toJulianDay } from "./julian-day";

interface TestCase {
	input: Date;
	output: number;
}

const testCases: TestCase[] = [
	{
		input: new Date(1957, 9, 4, 19, 26, 24),
		output: 2436116.31
	},
	{
		input: new Date(2000, 0, 1, 12),
		output: 2451545
	},
	{
		input: new Date(1999, 0, 1),
		output: 2451179.5
	},
	{
		input: new Date(1987, 5, 19, 12),
		output: 2446966
	},
	{
		input: new Date(1988, 0, 27),
		output: 2447187.5
	},
	{
		input: new Date(1988, 5, 19, 12),
		output: 2447332
	},
	{
		input: new Date(1900, 0, 1),
		output: 2415020.5
	},
	{
		input: new Date(1600, 0, 1),
		output: 2305447.5
	},
	{
		input: new Date(1600, 11, 31),
		output: 2305812.5
	},
	{
		input: new Date(837, 3, 10, 7, 12),
		output: 2026871.8
	},
	{
		input: new Date(-123, 11, 31),
		output: 1676496.5
	},
	{
		input: new Date(-122, 0, 1),
		output: 1676497.5
	},
	{
		input: new Date(-1000, 6, 12, 12),
		output: 1356001
	},
	/* {
		input: new Date(-1000, 1, 29),
		output: 1355866.5
	}, */
	{
		input: new Date(-1001, 7, 17, 21, 36),
		output: 1355671.4
	},
	{
		input: new Date(-4712, 0, 1, 12),
		output: 0
	}
];

describe("Gregorian date to Julian day conversion", () => {
	it("Converts a gregorian date to Julian day", () => {
		for (const { input, output } of testCases) {
			expect(toJulianDay(input)).toBe(output);
		}
	});
	it("Calculates the Modified Julian Day", () => {
		expect(getMJD(new Date(1858, 10, 17))).toBe(0);
	});
	it("Converts a Julian Day into calendar date", () => {
		expect(fromJulianDay(2436116.31).getTime()).toBe(new Date(1957, 9, 4, 19, 26, 24).getTime());
	});
});
