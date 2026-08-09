import { describe, expect, it } from "vitest";

import { wrapPhase } from "./wrap-phase";

describe("wrapPhase", () => {
	it("wraps tweened phases into the rendering range", () => {
		expect(wrapPhase(1.1)).toBeCloseTo(0.1);
		expect(wrapPhase(-0.05)).toBeCloseTo(0.95);
	});
});
