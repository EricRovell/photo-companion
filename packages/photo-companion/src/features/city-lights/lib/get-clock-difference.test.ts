import { describe, expect, it } from "vitest";

import { getClockDifference } from "./get-clock-difference";

describe("getClockDifference", () => {
	it("normalizes clock differences across midnight", () => {
		const beforeMidnight = new Date(2026, 0, 1, 23, 58).getTime();
		const afterMidnight = new Date(2026, 0, 2, 0, 2).getTime();

		expect(getClockDifference(afterMidnight, beforeMidnight)).toBe(4);
		expect(getClockDifference(beforeMidnight, afterMidnight)).toBe(-4);
	});
});
