import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parseDateTimeString } from ".";

const NOW = new Date(2026, 7, 2, 10, 30, 47);

describe("datetime-local adapter", () => {
	beforeEach(() => {
		vi.setSystemTime(NOW);
		vi.spyOn(console, "warn").mockImplementation(() => void 0);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("adds zero seconds to a minute-precision browser value", () => {
		expect(parseDateTimeString("2027-04-05T12:45"))
			.toEqual(new Date(2027, 3, 5, 12, 45, 0));
	});

	it("preserves seconds from a second-precision browser value", () => {
		expect(parseDateTimeString("2027-04-05T12:45:36"))
			.toEqual(new Date(2027, 3, 5, 12, 45, 36));
		expect(parseDateTimeString("2027-04-05T12:45:36.000"))
			.toEqual(new Date(2027, 3, 5, 12, 45, 36));
	});

	it("falls back to now for invalid browser input", () => {
		expect(parseDateTimeString("invalid")).toEqual(NOW);
	});
});
