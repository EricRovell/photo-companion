import { persistable } from "./helpers/persistable";
import { SETTINGS_DEFAULT, SETTINGS_LOCAL_STORAGE_KEY } from "./constants";
import type { SettingsStore } from "./types";

export const settingsStore = persistable<SettingsStore>(
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_DEFAULT
);
