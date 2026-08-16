import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { renderHook, waitFor } from "@solidjs/testing-library";
import { beforeEach, describe, expect, it } from "vitest";

import type { ParentProps } from "solid-js";

import { SETTINGS_DEFAULT, SettingsProvider, useSettings } from "~/features/settings";

import { useLocationQuery } from "./use-location-query";

const STORED_COORDINATES = {
	latitude: 51.5072,
	longitude: -0.1276
};

function renderLocationQueryHook(location: string) {
	const history = createMemoryHistory();

	history.set({ replace: true, scroll: false, value: location });

	const wrapper = (props: ParentProps) => (
		<SettingsProvider>
			<MemoryRouter history={history}>
				<Route component={() => props.children} path="/moon" />
			</MemoryRouter>
		</SettingsProvider>
	);

	const hook = renderHook(() => {
		useLocationQuery();
		return useSettings();
	}, { wrapper });

	return { history, ...hook };
}

function storeSettings() {
	localStorage.setItem("settings", "4");
	localStorage.setItem("settings:4", JSON.stringify({
		...SETTINGS_DEFAULT,
		...STORED_COORDINATES
	}));
}

describe("useLocationQuery", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("uses stored coordinates without adding them to an empty query", () => {
		storeSettings();
		const { history, result } = renderLocationQueryHook("/moon");

		expect(result.settings.latitude).toBe(STORED_COORDINATES.latitude);
		expect(result.settings.longitude).toBe(STORED_COORDINATES.longitude);
		expect(history.get()).toBe("/moon");
	});

	it("persists valid coordinates and preserves them in the query", async () => {
		const location = "/moon?latitude=-33.8688&longitude=151.2093&param=1";
		const { history, result } = renderLocationQueryHook(location);

		await waitFor(() => {
			expect(result.settings.latitude).toBe(-33.8688);
			expect(result.settings.longitude).toBe(151.2093);
		});

		expect(history.get()).toBe(location);
		expect(JSON.parse(localStorage.getItem("settings:4") ?? "null")).toMatchObject({
			latitude: -33.8688,
			longitude: 151.2093
		});
	});

	it.each([
		"/moon?latitude=91&longitude=0",
		"/moon?latitude=0&longitude=181",
		"/moon?latitude=&longitude=0",
		"/moon?latitude=0",
		"/moon?longitude=0"
	])("ignores invalid or incomplete coordinates: %s", async (location) => {
		const { history, result } = renderLocationQueryHook(location);

		await waitFor(() => {
			expect(result.settings.latitude).toBe(SETTINGS_DEFAULT.latitude);
			expect(result.settings.longitude).toBe(SETTINGS_DEFAULT.longitude);
		});

		expect(history.get()).toBe(location);
		expect(localStorage.getItem("settings:4")).toBeNull();
	});
});
