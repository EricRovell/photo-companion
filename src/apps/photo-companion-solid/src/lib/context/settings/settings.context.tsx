import { createSignal, createContext, useContext, onMount, createEffect, type ParentProps } from "solid-js";
import { isNullable } from "utils/validators";

import { SETTINGS_DEFAULT } from "./settings.const";
import { storage } from "./settings-store";
import type { SettingsContextType, SettingsStore } from "./settings.types";

const SettingsContext = createContext<SettingsContextType>();

export function SettingsProvider(props: ParentProps) {
	const [ getSettings, setSettings ] = createSignal<SettingsStore>(SETTINGS_DEFAULT);

	function resetSettings(): void {
		setSettings(SETTINGS_DEFAULT);
	}

	onMount(() => {
		setSettings({
			...SETTINGS_DEFAULT,
			...storage.read() ?? {}
		});
	});

	createEffect(() => {
		storage.write(getSettings());
	});

	return (
		<SettingsContext.Provider value={{
			getSettings,
			setSettings,
			resetSettings
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
