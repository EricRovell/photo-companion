import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { renderHook, waitFor } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ParentProps } from "solid-js";

import { useDatetime } from "./use-datetime";

const NOW = new Date(2026, 7, 2, 10, 30);
const SELECTED_DATETIME = new Date(2027, 3, 5, 12, 45);

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

		expect(result.getDatetimeQuery()).toBe("2026-08-02-10-30");
		expect(result.getTimestamp()).toBe(NOW.getTime());
		expect(history.get()).toBe("/moon");
	});

	it("writes an explicitly selected date and preserves other query parameters", async () => {
		const { history, result } = renderDatetimeHook("/moon?param=1");

		result.setDatetimeQuery(SELECTED_DATETIME);

		await waitFor(() => {
			expect(result.getDatetimeQuery()).toBe("2027-04-05-12-45");
			expect(history.get()).toBe("/moon?param=1&datetime=2027-04-05-12-45");
		});
	});

	it("removes only the datetime query when returning to now", async () => {
		const { history, result } = renderDatetimeHook("/moon?datetime=2025-01-02-03-04&param=1");

		result.setDatetimeQuery();

		await waitFor(() => {
			expect(result.getDatetimeQuery()).toBe("2026-08-02-10-30");
			expect(history.get()).toBe("/moon?param=1");
		});
	});
});
