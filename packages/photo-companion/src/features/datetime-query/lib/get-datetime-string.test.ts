import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getDateTimeString } from ".";

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

	it("formats values with seconds", () => {
		expect(getDateTimeString(new Date(2027, 3, 5, 12, 45, 36)))
			.toBe("2027-04-05T12:45:36");
	});
});
