import { cleanup, fireEvent, renderHook } from "@solidjs/testing-library";
import { createMemo } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ParentProps } from "solid-js";

import { ClockProvider, useClock } from "./clock";

const NOW = new Date("2026-10-31T12:00:00Z").getTime();

function renderClocks(throttleInterval?: number) {
	const calculate = vi.fn();

	const wrapper = (props: ParentProps) => (
		<ClockProvider throttleInterval={throttleInterval}>
			{props.children}
		</ClockProvider>
	);

	const hook = renderHook(() => {
		const clock = useClock();
		const throttled = useClock({ throttle: true });

		const calculation = createMemo(() => {
			calculate();
			return throttled.getTimestamp();
		});

		return {
			calculation,
			clock,
			peer: useClock({ throttle: true }),
			throttled
		};
	}, { wrapper });

	return {
		calculate,
		...hook
	};
}

describe("useClock", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("shares one timer and only notifies throttled calculations every fifteen seconds", () => {
		const { calculate, result } = renderClocks();

		expect(vi.getTimerCount()).toBe(1);
		expect(result.throttled.getTimestamp).toBe(result.peer.getTimestamp);
		expect(calculate).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(14_999);
		expect(result.clock.getTimestamp()).toBe(NOW + 14_000);
		expect(result.throttled.getTimestamp()).toBe(NOW);
		expect(calculate).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(1);
		expect(result.calculation()).toBe(NOW + 15_000);
		expect(calculate).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(15_000);
		expect(result.calculation()).toBe(NOW + 30_000);
		expect(calculate).toHaveBeenCalledTimes(3);
		expect(vi.getTimerCount()).toBe(1);
	});

	it("uses the provider's configured throttle interval", () => {
		const { result } = renderClocks(5000);

		vi.advanceTimersByTime(4999);
		expect(result.throttled.getTimestamp()).toBe(NOW);
		vi.advanceTimersByTime(1);
		expect(result.throttled.getTimestamp()).toBe(NOW + 5000);
		expect(vi.getTimerCount()).toBe(1);
	});

	it("sets now immediately for every consumer and starts a new throttle window", () => {
		const { calculate, result } = renderClocks();
		vi.advanceTimersByTime(3000);
		result.clock.setNow();

		expect(result.throttled.getTimestamp()).toBe(NOW + 3000);
		expect(result.peer.getTimestamp()).toBe(NOW + 3000);
		expect(calculate).toHaveBeenCalledTimes(2);
		vi.advanceTimersByTime(14_999);
		expect(result.throttled.getTimestamp()).toBe(NOW + 3000);
		vi.advanceTimersByTime(1);
		expect(result.throttled.getTimestamp()).toBe(NOW + 18_000);
		expect(vi.getTimerCount()).toBe(1);
	});

	it("bypasses throttling after a short hidden interval and cleans up the timer", () => {
		let visibility: DocumentVisibilityState = "visible";
		vi.spyOn(document, "visibilityState", "get").mockImplementation(() => visibility);
		const { cleanup, result } = renderClocks();

		visibility = "hidden";
		fireEvent(document, new Event("visibilitychange"));
		expect(vi.getTimerCount()).toBe(0);
		vi.advanceTimersByTime(2000);
		visibility = "visible";
		fireEvent(document, new Event("visibilitychange"));

		expect(result.clock.getTimestamp()).toBe(NOW + 2000);
		expect(result.throttled.getTimestamp()).toBe(NOW + 2000);
		expect(vi.getTimerCount()).toBe(1);
		cleanup();
		expect(vi.getTimerCount()).toBe(0);
	});

	it("catches up on the next tick after callbacks are delayed", () => {
		const { result } = renderClocks();
		vi.setSystemTime(NOW + 60_000);
		vi.advanceTimersByTime(1000);

		expect(result.clock.getTimestamp()).toBe(NOW + 61_000);
		expect(result.throttled.getTimestamp()).toBe(NOW + 61_000);
	});

	it("resynchronizes when the system clock moves backward", () => {
		const { result } = renderClocks();
		vi.setSystemTime(NOW - 10_000);
		vi.advanceTimersByTime(1000);

		expect(result.clock.getTimestamp()).toBe(NOW - 9000);
		expect(result.throttled.getTimestamp()).toBe(NOW - 9000);
	});
});
