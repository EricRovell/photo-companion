import { isSupportedCity } from "lights-schedule";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { Storage } from "versioned-local-storage";

import {
	SETTINGS_DEFAULT,
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION
} from "./settings.const";

import type { SettingsStore } from "./settings.types";

export function createSettingsState() {
	const storage = new Storage(SETTINGS_LOCAL_STORAGE_KEY, {
		version: SETTINGS_LOCAL_STORAGE_VERSION
	});

	const [ settings, setSettings ] = createStore<SettingsStore>({
		...SETTINGS_DEFAULT,
		...storage.read() ?? {}
	});

	const resetSettings = () => {
		setSettings(reconcile(SETTINGS_DEFAULT));
		storage.write({ ...unwrap(settings) });
	};

	const setSettingsWithEffect: typeof setSettings = (...args: unknown[]) => {
		// @ts-expect-error: types are fine
		setSettings(...args);
		storage.write({ ...unwrap(settings) });
	};

	const isSupportsCityLights = () => isSupportedCity(settings.city);
	const isSupportsBridges = () => settings.city === "SAINT_PETERSBURG";

	return {
		isSupportsBridges,
		isSupportsCityLights,
		resetSettings,
		setSettings: setSettingsWithEffect,
		settings
	};
}
