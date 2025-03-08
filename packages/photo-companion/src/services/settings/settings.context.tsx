import { createContext } from "solid-js";

import { createProvider } from "~/helpers/create-provider";

import { createSettingsState } from "./settings.state";

const SettingsContext = createContext<ReturnType<typeof createSettingsState>>();

export const [ SettingsProvider, useSettings ] = createProvider({
	consumerName: "useSettings",
	Context: SettingsContext,
	getValue: createSettingsState,
	providerName: "Settings"
});
