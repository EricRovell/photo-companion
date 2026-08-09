import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import { circular, createTweened, linear } from "./tweened";

describe("createTweened", () => {
	it("maps the exposed value", () => {
		createRoot((dispose) => {
			const value = createTweened(() => 1.1, {
				map: current => current % 1
			});

			expect(value()).toBeCloseTo(0.1);
			dispose();
		});
	});
});

describe("circular", () => {
	it("crosses a wrapped boundary in the shortest direction", () => {
		const interpolate = circular(1);

		expect(interpolate(0.95, 0.1, 1)).toBeCloseTo(1.1);
		expect(interpolate(0.1, 0.95, 1)).toBeCloseTo(-0.05);
	});

	it("uses the direct path when it is already the shortest", () => {
		expect(circular(1)(0.2, 0.4, 1)).toBeCloseTo(0.4);
	});

	it("interpolates using the supplied progress", () => {
		expect(circular(1)(0.95, 0.1, 0.5)).toBeCloseTo(1.025);
	});

	it("rejects a non-positive period", () => {
		expect(() => circular(0)).toThrow(RangeError);
	});
});

describe("linear", () => {
	it("interpolates directly between values", () => {
		expect(linear(0.95, 0.1, 0.5)).toBeCloseTo(0.525);
	});
});
