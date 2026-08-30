import { isSupportedCity } from "lights-schedule";
import { createContext } from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { isLatitude, isLongitude } from "utils/validators";
import { Storage } from "versioned-local-storage";

import { createProvider } from "~/shared/lib/create-provider";

import {
	SETTINGS_DEFAULT,
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION
} from "../consts/model";

import type { SettingsStore } from "../types";

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

	const isSupportsCityLights = () => (
		isSupportedCity(settings.city) || (
			isLatitude(settings.latitude) &&
			isLongitude(settings.longitude)
		)
	);

	const isSupportsBridges = () => settings.city === "SAINT_PETERSBURG";

	return {
		isSupportsBridges,
		isSupportsCityLights,
		resetSettings,
		setSettings: setSettingsWithEffect,
		settings
	};
}

const SettingsContext = createContext<ReturnType<typeof createSettingsState>>();

export const [ SettingsProvider, useSettings ] = createProvider({
	consumerName: "useSettings",
	Context: SettingsContext,
	getValue: createSettingsState,
	providerName: "Settings"
});
