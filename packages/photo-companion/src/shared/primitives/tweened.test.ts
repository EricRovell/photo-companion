import { createRoot, createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { circular, createTweened, linear } from "./tweened";

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("createTweened", () => {
	it("updates immediately without requesting animation frames when reduced motion is enabled", () => {
		vi.stubGlobal("matchMedia", vi.fn(() => Object.assign(new EventTarget(), { matches: true })));
		const requestFrame = vi.spyOn(window, "requestAnimationFrame");
		const state = createRoot(dispose => {
			const [ target, setTarget ] = createSignal(0);
			return { dispose, setTarget, value: createTweened(target) };
		});

		try {
			state.setTarget(1);
			expect(state.value()).toBe(1);
			expect(requestFrame).not.toHaveBeenCalled();
		} finally {
			state.dispose();
		}
	});

	it("cancels an active tween when reduced motion is enabled without another target change", () => {
		const media = Object.assign(new EventTarget(), { matches: false });
		vi.stubGlobal("matchMedia", vi.fn(() => media));
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(123);
		const cancelFrame = vi.spyOn(window, "cancelAnimationFrame");
		const state = createRoot(dispose => {
			const [ target, setTarget ] = createSignal(0);
			return { dispose, setTarget, value: createTweened(target) };
		});

		try {
			state.setTarget(1);
			expect(state.value()).toBe(0);
			media.matches = true;
			media.dispatchEvent(new Event("change"));
			expect(state.value()).toBe(1);
			expect(cancelFrame).toHaveBeenCalledWith(123);
		} finally {
			state.dispose();
		}
	});

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
