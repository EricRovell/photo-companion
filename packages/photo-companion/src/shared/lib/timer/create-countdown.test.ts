import { fireEvent, renderHook } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCountdown } from "./create-countdown";

describe("createCountdown", () => {
	let visibilityState: DocumentVisibilityState;

	beforeEach(() => {
		vi.useFakeTimers();

		visibilityState = "visible";
		vi.spyOn(document, "visibilityState", "get").mockImplementation(() => visibilityState);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("preserves elapsed time when the duration changes", () => {
		const [ getEnd, setEnd ] = createSignal(60_000);

		const { result } = renderHook(() => createCountdown({
			getTimestampEnd: getEnd,
			getTimestampStart: () => 0
		}));

		expect(result()).toBe(60_000);

		vi.advanceTimersByTime(15_000);
		expect(result()).toBe(45_000);

		setEnd(120_000);
		expect(result()).toBe(105_000);
	});

	it("fully resynchronizes when the document becomes visible", () => {
		const [ getEnd, setEnd ] = createSignal(60_000);

		const { result } = renderHook(() => createCountdown({
			getTimestampEnd: getEnd,
			getTimestampStart: () => 0
		}));

		vi.advanceTimersByTime(15_000);
		expect(result()).toBe(45_000);

		visibilityState = "hidden";
		fireEvent(document, new Event("visibilitychange"));
		setEnd(120_000);

		visibilityState = "visible";
		fireEvent(document, new Event("visibilitychange"));

		expect(result()).toBe(120_000);
	});
});
