import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { cleanup, fireEvent, renderHook } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Accessor, ParentProps } from "solid-js";

import { DatetimeProvider } from "./datetime-provider";
import { useCountdown } from "./use-countdown";
import { useDatetime } from "./use-datetime";

const NOW = new Date(2026, 7, 2, 10, 30, 47);
const RESET_NOW = new Date(2026, 7, 2, 11, 15, 29);
const SELECTED_DATETIME = new Date(2027, 3, 5, 12, 45, 36);

function createLocation(pathname: string, params: [ string, string ][]): string {
	const searchParams = new URLSearchParams(params);
	return `${pathname}?${searchParams.toString()}`;
}

function renderDatetimeHook(location: string, options: {
	autoplayInterval?: number;
	getCountdownEnd?: Accessor<Nullable<number>>;
} = {}) {
	const history = createMemoryHistory();

	history.set({
		replace: true,
		scroll: false,
		value: location
	});
	vi.advanceTimersByTime(0);

	const wrapper = (props: ParentProps) => (
		<MemoryRouter
			history={history}
			root={rootProps => (
				<DatetimeProvider autoplayInterval={options.autoplayInterval}>
					{rootProps.children}
				</DatetimeProvider>
			)}
		>
			<Route
				component={() => props.children}
				path={[ "/moon", "/sun" ]}
			/>
		</MemoryRouter>
	);

	const hook = renderHook(() => {
		const state = useDatetime();

		return {
			...state,
			countdown: useCountdown(options.getCountdownEnd ?? (() => NOW.getTime() + 60_000)),
			peer: useDatetime()
		};
	}, { wrapper });

	return {
		history,
		...hook
	};
}

describe("useDatetime", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		cleanup();

		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("uses the current time without adding it to an empty query", () => {
		const { history, result } = renderDatetimeHook("/moon");

		expect(result.getDatetimeQuery()).toBe("2026-08-02T10:30:47");
		expect(result.getTimestamp()).toBe(NOW.getTime());
		expect(result.isAutoplay()).toBe(true);
		expect(history.get()).toBe("/moon");
	});

	it("shares one clock and updates overall state only every fifteen seconds", () => {
		const { history, result } = renderDatetimeHook("/moon?param=1");
		const initialDate = result.getDatetime();

		expect(result.peer.getTimerTimestamp).toBe(result.getTimerTimestamp);
		expect(result.peer.getDatetime).toBe(result.getDatetime);
		expect(vi.getTimerCount()).toBe(1);

		vi.advanceTimersByTime(1000);
		expect(result.countdown()).toBe(59_000);
		expect(result.getTimerTimestamp()).toBe(NOW.getTime() + 1000);
		expect(result.getTimerDatetime().getTime()).toBe(NOW.getTime() + 1000);
		expect(result.getDatetime()).toBe(initialDate);

		vi.advanceTimersByTime(13_999);
		expect(result.getDatetime()).toBe(initialDate);

		vi.advanceTimersByTime(1);
		expect(result.getTimestamp()).toBe(NOW.getTime() + 15_000);
		expect(result.getTimerTimestamp()).toBe(NOW.getTime() + 15_000);
		expect(result.countdown()).toBe(45_000);
		expect(history.get()).toBe("/moon?param=1");
	});

	it("accepts a configured autoplay interval", () => {
		const { result } = renderDatetimeHook("/moon", { autoplayInterval: 5000 });

		vi.advanceTimersByTime(4999);
		expect(result.getTimestamp()).toBe(NOW.getTime());

		vi.advanceTimersByTime(1);
		expect(result.getTimestamp()).toBe(NOW.getTime() + 5000);
	});

	it("keeps an explicit date fixed while its timer advances from that selected time", () => {
		const { result } = renderDatetimeHook("/moon?datetime=2027-04-05T12:45:36");

		expect(result.isAutoplay()).toBe(false);
		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime());
		expect(vi.getTimerCount()).toBe(1);

		vi.advanceTimersByTime(18_000);

		expect(result.getDatetimeQuery()).toBe("2027-04-05T12:45:36");
		expect(result.getTimestamp()).toBe(SELECTED_DATETIME.getTime());
		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 18_000);
	});

	it("counts down from the selected date and switches to live time when reset", async () => {
		const { result } = renderDatetimeHook("/moon?datetime=2026-08-02T10:30:17");

		expect(result.countdown()).toBe(90_000);
		vi.advanceTimersByTime(18_000);
		expect(result.countdown()).toBe(72_000);
		expect(result.getTimestamp()).toBe(NOW.getTime() - 30_000);
		expect(vi.getTimerCount()).toBe(1);

		result.setDatetimeQuery();
		await vi.advanceTimersByTimeAsync(0);
		expect(result.countdown()).toBe(42_000);
	});

	it("handles an unavailable countdown target and reacts when the event becomes available", () => {
		const [ getCountdownEnd, setCountdownEnd ] = createSignal<Nullable<number>>(null);
		const { result } = renderDatetimeHook("/moon", { getCountdownEnd });

		expect(result.countdown()).toBe(0);
		vi.advanceTimersByTime(1000);
		setCountdownEnd(NOW.getTime() + 60_000);
		expect(result.countdown()).toBe(59_000);
		vi.advanceTimersByTime(1000);
		expect(result.countdown()).toBe(58_000);
		setCountdownEnd(undefined);
		expect(result.countdown()).toBe(0);
	});

	it("writes an explicitly selected date and preserves other query parameters", async () => {
		const { history, result } = renderDatetimeHook("/moon?param=1");

		result.setDatetimeQuery(SELECTED_DATETIME);
		await vi.advanceTimersByTimeAsync(0);

		expect(result.getDatetimeQuery()).toBe("2027-04-05T12:45:36");
		expect(history.get()).toBe(createLocation("/moon", [
			[ "param", "1" ],
			[ "datetime", "2027-04-05T12:45:36" ]
		]));

		expect(result.isAutoplay()).toBe(false);

		vi.advanceTimersByTime(15_000);
		expect(result.getTimestamp()).toBe(SELECTED_DATETIME.getTime());
		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 15_000);
	});

	it("removes only the datetime query and refreshes the fallback when returning to now", async () => {
		const location = createLocation("/moon", [
			[ "datetime", "2025-01-02T03:04:05" ],
			[ "param", "1" ]
		]);

		const { history, result } = renderDatetimeHook(location);

		vi.setSystemTime(RESET_NOW);

		result.setDatetimeQuery();
		await vi.advanceTimersByTimeAsync(0);

		expect(result.getDatetimeQuery()).toBe("2026-08-02T11:15:29");
		expect(result.getTimestamp()).toBe(RESET_NOW.getTime());
		expect(history.get()).toBe("/moon?param=1");

		expect(result.isAutoplay()).toBe(true);
		expect(result.getTimerTimestamp()).toBe(RESET_NOW.getTime());

		vi.advanceTimersByTime(15_000);

		expect(result.getTimestamp()).toBe(RESET_NOW.getTime() + 15_000);
		expect(result.getTimerTimestamp()).toBe(RESET_NOW.getTime() + 15_000);
	});

	it("retains timer progress when unrelated query parameters change", async () => {
		const { history, result } = renderDatetimeHook("/moon?datetime=2027-04-05T12:45:36");
		vi.advanceTimersByTime(3000);

		history.set({ value: "/moon?datetime=2027-04-05T12:45:36&param=2" });
		await vi.advanceTimersByTimeAsync(0);
		expect(history.get()).toContain("param=2");

		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 3000);

		vi.advanceTimersByTime(1000);

		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 4000);
	});

	it("resets the timer anchor when another explicit date is selected", async () => {
		const { result } = renderDatetimeHook("/moon?datetime=2025-01-02T03:04:05");
		vi.advanceTimersByTime(3000);

		result.setDatetimeQuery(SELECTED_DATETIME);

		await vi.advanceTimersByTimeAsync(0);

		expect(result.getTimestamp()).toBe(SELECTED_DATETIME.getTime());
		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime());

		vi.advanceTimersByTime(1000);

		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 1000);
	});

	it("preserves the selected timer when navigating to another page", async () => {
		const { history, result } = renderDatetimeHook("/moon?datetime=2027-04-05T12:45:36");
		vi.advanceTimersByTime(3000);
		history.set({ value: "/sun?datetime=2027-04-05T12:45:36" });
		await vi.advanceTimersByTimeAsync(0);

		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 3000);
		vi.advanceTimersByTime(1000);
		expect(result.getTimerTimestamp()).toBe(SELECTED_DATETIME.getTime() + 4000);
	});

	it("resumes autoplay when navigation removes the explicit date", async () => {
		const { history, result } = renderDatetimeHook("/moon?datetime=2027-04-05T12:45:36");
		vi.advanceTimersByTime(3000);
		history.set({ value: "/moon?param=1" });
		await vi.advanceTimersByTimeAsync(0);

		expect(result.isAutoplay()).toBe(true);
		expect(result.getTimestamp()).toBe(NOW.getTime() + 3000);
		vi.advanceTimersByTime(15_000);
		expect(result.getTimestamp()).toBe(NOW.getTime() + 18_000);
	});

	it.each([ false, true ])("resynchronizes after a hidden tab wakes up (selected: %s)", (selected) => {
		let visibility: DocumentVisibilityState = "visible";
		vi.spyOn(document, "visibilityState", "get").mockImplementation(() => visibility);
		const { result } = renderDatetimeHook(selected ? "/moon?datetime=2027-04-05T12:45:36" : "/moon");

		visibility = "hidden";
		fireEvent(document, new Event("visibilitychange"));
		vi.setSystemTime(NOW.getTime() + 90_000);
		visibility = "visible";
		fireEvent(document, new Event("visibilitychange"));

		expect(result.getTimestamp()).toBe(selected ? SELECTED_DATETIME.getTime() : NOW.getTime() + 90_000);
		expect(result.getTimerTimestamp()).toBe((selected ? SELECTED_DATETIME : NOW).getTime() + 90_000);
	});

	it("reads wall time after delayed callbacks and disposes the shared timer", () => {
		const { cleanup, result } = renderDatetimeHook("/moon");
		vi.setSystemTime(NOW.getTime() + 60_000);
		vi.advanceTimersByTime(1000);

		expect(result.getTimestamp()).toBe(NOW.getTime() + 61_000);
		expect(result.getTimerTimestamp()).toBe(NOW.getTime() + 61_000);
		vi.advanceTimersByTime(15_000);

		expect(result.getTimestamp()).toBe(NOW.getTime() + 76_000);
		expect(result.getTimerTimestamp()).toBe(NOW.getTime() + 76_000);
		cleanup();
		expect(vi.getTimerCount()).toBe(0);
	});
});
