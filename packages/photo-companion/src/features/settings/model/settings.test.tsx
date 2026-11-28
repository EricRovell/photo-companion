import { cleanup } from "@solidjs/testing-library";
import { renderHook } from "~test";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SETTINGS_DEFAULT } from "../consts/model";
import { SettingsProvider, useSettings } from "./settings";

beforeEach(() => localStorage.clear());

afterEach(cleanup);

describe("settings persistence", () => {
	it("persists pending draft updates, including consecutive writes and nested arrays", () => {
		const { result } = renderHook(useSettings, { wrapper: SettingsProvider });

		result.setSettings((draft) => {
			draft.latitude = -33.8;
		});

		result.setSettings((draft) => {
			draft.longitude = 151.2;
			draft.tabs = [ "SUN", "MOON" ];
		});

		expect(JSON.parse(localStorage.getItem("settings:4") ?? "null")).toMatchObject({
			latitude: -33.8,
			longitude: 151.2,
			tabs: [ "SUN", "MOON" ]
		});

		flush();
		expect(result.settings.tabs).toStrictEqual([ "SUN", "MOON" ]);
		expect(SETTINGS_DEFAULT.tabs).toContain("NOW");
	});

	it("persists replacement and reset values before the next render", () => {
		const { result } = renderHook(useSettings, { wrapper: SettingsProvider });

		result.setSettings(() => ({
			...SETTINGS_DEFAULT,
			city: "MOSCOW"
		}));


		expect(JSON.parse(localStorage.getItem("settings:4") ?? "null").city).toBe("MOSCOW");

		flush();
		expect(result.settings.city).toBe("MOSCOW");

		result.resetSettings();
		expect(JSON.parse(localStorage.getItem("settings:4") ?? "null")).toStrictEqual(SETTINGS_DEFAULT);

		flush();
		expect(result.settings.city).toBe(SETTINGS_DEFAULT.city);
	});
});
