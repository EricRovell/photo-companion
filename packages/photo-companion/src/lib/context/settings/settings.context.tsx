import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { isNullable } from "utils/validators";
import { Storage } from "versioned-local-storage";

import {
	SETTINGS_DEFAULT,
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION
} from "./settings.const";

import type { SettingsContextType, SettingsStore } from "./settings.types";

export const storage = new Storage(SETTINGS_LOCAL_STORAGE_KEY, {
	version: SETTINGS_LOCAL_STORAGE_VERSION
});

const SettingsContext = createContext<SettingsContextType>();

export function SettingsProvider(props: ParentProps) {
	const [ settings, setSettings ] = createStore<SettingsStore>({
		...SETTINGS_DEFAULT,
		...storage.read() ?? {}
	});

	function resetSettings(): void {
		setSettings(reconcile(SETTINGS_DEFAULT));
		storage.write({ ...unwrap(settings) });
	}

	const setSettingsWithEffect: typeof setSettings = (...args: unknown[]) => {
		// @ts-expect-error: types are fine
		setSettings(...args);
		storage.write({ ...unwrap(settings) });
	};

	return (
		<SettingsContext.Provider value={{
			resetSettings,
			setSettings: setSettingsWithEffect,
			settings
		}}>
			{props.children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const value = useContext(SettingsContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a Settings.Provider");
	}

	return value;
}
