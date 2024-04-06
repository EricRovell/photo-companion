import { createEffect, createRoot, createSignal, onMount } from "solid-js";
import { Storage } from "versioned-local-storage";

import {
	SETTINGS_DEFAULT,
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION
} from "./settings.const";
import type { SettingsStore } from ".";

const storage = new Storage(
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_LOCAL_STORAGE_VERSION
);

export const [ settings, setSettings ] = createSignal<SettingsStore>(SETTINGS_DEFAULT);

export function resetSettings(): void {
	setSettings(SETTINGS_DEFAULT);
}

createRoot(() => {
	onMount(() => {
		setSettings({
			...SETTINGS_DEFAULT,
			...storage.read() ?? {}
		});
	});

	createEffect(() => {
		storage.write(settings());
	});
});
