import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { renderHook, waitFor } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ParentProps } from "solid-js";

import { useDatetime } from "./use-datetime";

const NOW = new Date(2026, 7, 2, 10, 30, 47);
const RESET_NOW = new Date(2026, 7, 2, 11, 15, 29);
const SELECTED_DATETIME = new Date(2027, 3, 5, 12, 45, 36);

function createLocation(pathname: string, params: [ string, string ][]): string {
	const searchParams = new URLSearchParams(params);
	return `${pathname}?${searchParams.toString()}`;
}

function renderDatetimeHook(location: string) {
	const history = createMemoryHistory();

	history.set({ replace: true, scroll: false, value: location });

	const wrapper = (props: ParentProps) => (
		<MemoryRouter history={history}>
			<Route component={() => props.children} path="/moon" />
		</MemoryRouter>
	);

	const hook = renderHook(useDatetime, { wrapper });

	return { history, ...hook };
}

describe("useDatetime", () => {
	beforeEach(() => {
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("uses the current time without adding it to an empty query", () => {
		const { history, result } = renderDatetimeHook("/moon");

		expect(result.getDatetimeQuery()).toBe("2026-08-02T10:30:47");
		expect(result.getTimestamp()).toBe(NOW.getTime());
		expect(history.get()).toBe("/moon");
	});

	it("writes an explicitly selected date and preserves other query parameters", async () => {
		const { history, result } = renderDatetimeHook("/moon?param=1");

		result.setDatetimeQuery(SELECTED_DATETIME);

		await waitFor(() => {
			expect(result.getDatetimeQuery()).toBe("2027-04-05T12:45:36");
			expect(history.get()).toBe(createLocation("/moon", [
				[ "param", "1" ],
				[ "datetime", "2027-04-05T12:45:36" ]
			]));
		});
	});

	it("removes only the datetime query and refreshes the fallback when returning to now", async () => {
		const location = createLocation("/moon", [
			[ "datetime", "2025-01-02T03:04:05" ],
			[ "param", "1" ]
		]);

		const { history, result } = renderDatetimeHook(location);

		vi.setSystemTime(RESET_NOW);

		result.setDatetimeQuery();

		await waitFor(() => {
			expect(result.getDatetimeQuery()).toBe("2026-08-02T11:15:29");
			expect(result.getTimestamp()).toBe(RESET_NOW.getTime());
			expect(history.get()).toBe("/moon?param=1");
		});
	});
});
