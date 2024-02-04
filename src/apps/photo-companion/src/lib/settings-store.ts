import { persistable } from "./helpers/persistable";
import { SETTINGS_DEFAULT } from "./constants";
import type { SettingsStore } from "./types";

const SETTINGS_LOCAL_STORAGE_KEY = "settings";

export const settingsStore = persistable<SettingsStore>(
	SETTINGS_LOCAL_STORAGE_KEY,
	SETTINGS_DEFAULT
);
