import { createRouter, memoryHistory } from "@solidjs/router";
import { waitFor } from "@solidjs/testing-library";
import { renderHook } from "~test";
import { describe, expect, it } from "vitest";

import type { ParentProps } from "solid-js";

import { useParsedSearchParams } from "./use-search-params";

function renderSearchParamsHook(location: string) {
	const history = memoryHistory();

	history.set({
		replace: true,
		scroll: false,
		value: location
	});

	const Router = createRouter({
		history,
		routes: [{ path: "/moon" }]
	});

	const wrapper = (props: ParentProps) => (
		<Router>{() => props.children}</Router>
	);

	const hook = renderHook(() => useParsedSearchParams({
		count: value => typeof value === "string" ? Number(value) : undefined,
		label: value => typeof value === "string" ? value.toUpperCase() : "DEFAULT"
	}), { wrapper });

	return {
		history,
		...hook
	};
}

describe("useParsedSearchParams", () => {
	it("parses only the requested query parameters", () => {
		const { result } = renderSearchParamsHook("/moon?count=3&label=night&ignored=true");
		const { searchParams } = result;

		expect(searchParams.count).toBe(3);
		expect(searchParams.label).toBe("NIGHT");
		expect(searchParams).not.toHaveProperty("ignored");
	});

	it("lets parsers provide values for missing parameters", () => {
		const { result } = renderSearchParamsHook("/moon");
		const { searchParams } = result;

		expect(searchParams.count).toBeUndefined();
		expect(searchParams.label).toBe("DEFAULT");
	});

	it("stays reactive and exposes the underlying query setter", async () => {
		const { history, result } = renderSearchParamsHook("/moon?label=night");
		const { searchParams, setSearchParams } = result;

		setSearchParams({ count: 4 });

		await waitFor(() => {
			expect(searchParams.count).toBe(4);
			expect(history.get()).toBe("/moon?label=night&count=4");
		});
	});
});
