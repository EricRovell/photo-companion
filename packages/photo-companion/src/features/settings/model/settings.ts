import { isSupportedCity } from "lights-schedule";
import { createContext } from "solid-js";
import { createStore, reconcile, snapshot } from "solid-js";
import { isLatitude, isLongitude } from "utils/validators";
import { Storage } from "versioned-local-storage";

import { createProvider } from "~/shared/lib/create-provider";

import {
	SETTINGS_DEFAULT,
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION
} from "../consts/model";

import type { SettingsStore } from "../types";

function createSettingsState() {
	const storage = new Storage(SETTINGS_LOCAL_STORAGE_KEY, {
		version: SETTINGS_LOCAL_STORAGE_VERSION
	});

	const [ settings, setSettingsStore ] = createStore<SettingsStore>({
		...SETTINGS_DEFAULT,
		...storage.read() ?? {}
	});

	const setSettings: typeof setSettingsStore = (update) => {
		setSettingsStore((draft) => {
			const replacement = update(draft);
			storage.write(snapshot(replacement ?? draft));
			return replacement;
		});
	};

	const resetSettings = () => setSettings(reconcile(SETTINGS_DEFAULT));

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
		setSettings,
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
