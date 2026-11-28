import { describe, expect, it } from "vitest";

import { refineMinimum, refineRoot } from "../src/shared";

describe("Numerical refinement", () => {
	it("refines a bracketed root to the requested tolerance", () => {
		const root = refineRoot({
			fn: value => value ** 2 - 4,
			left: 0,
			right: 5,
			tolerance: 0.000_001
		});

		expect(root).toBeCloseTo(2, 5);
	});

	it("refines a bounded minimum to the requested tolerance", () => {
		const minimum = refineMinimum({
			fn: value => (value - 3) ** 2 + 7,
			left: -10,
			right: 10,
			tolerance: 0.000_001
		});

		expect(minimum).toBeCloseTo(3, 5);
	});
});
