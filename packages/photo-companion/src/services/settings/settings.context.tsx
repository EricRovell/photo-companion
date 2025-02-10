import { createContext, type ParentProps, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import { createSettingsState } from "./settings.state";

const SettingsContext = createContext<ReturnType<typeof createSettingsState>>();

export function SettingsProvider(props: ParentProps) {
	const state = createSettingsState();

	return (
		<SettingsContext.Provider value={state}>
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
