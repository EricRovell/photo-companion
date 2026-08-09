import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createQueryDate, parseDatetimeLocal, parseQueryDate } from ".";

const NOW = new Date(2026, 7, 2, 10, 30, 47, 321);

describe("query dates", () => {
	beforeEach(() => {
		vi.setSystemTime(NOW);
		vi.spyOn(console, "warn").mockImplementation(() => void 0);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("serializes a local date with second precision", () => {
		const input = new Date(2027, 3, 5, 12, 45, 36, 999);

		expect(createQueryDate(input)).toBe("2027-04-05T12:45:36");
	});

	it("parses a valid local ISO query without Date string parsing", () => {
		const output = parseQueryDate("2027-04-05T12:45:36");

		expect(output).toEqual(new Date(2027, 3, 5, 12, 45, 36));
	});

	it("accepts a valid leap date and zero seconds", () => {
		expect(parseQueryDate("2028-02-29T23:59:00"))
			.toEqual(new Date(2028, 1, 29, 23, 59, 0));
	});

	it.each([
		"2027-04-05-12-45",
		"2027-04-05T12:45",
		"2027-02-29T12:45:36",
		"2027-13-05T12:45:36",
		"2027-04-05T24:00:00"
	])("falls back to the current datetime for an invalid query: %s", (input) => {
		expect(parseQueryDate(input)).toEqual(NOW);
		expect(console.warn).toHaveBeenCalledWith(`Invalid date input: ${input}`);
	});

	it("accepts both browser-normalized datetime-local shapes", () => {
		expect(parseDatetimeLocal("2027-04-05T12:45"))
			.toEqual(new Date(2027, 3, 5, 12, 45, 0));
		expect(parseDatetimeLocal("2027-04-05T12:45:36"))
			.toEqual(new Date(2027, 3, 5, 12, 45, 36));
	});

	it("returns null for an invalid datetime-local value", () => {
		expect(parseDatetimeLocal("invalid")).toBeNull();
	});
});
