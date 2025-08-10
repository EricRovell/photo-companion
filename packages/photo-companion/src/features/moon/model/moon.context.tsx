import { createContext } from "solid-js";

import { createProvider } from "~/shared/lib/create-provider";

import { createMoonServiceState } from ".";

const MoonServiceContext = createContext<ReturnType<typeof createMoonServiceState>>();

export const [ MoonProvider, useMoonService ] = createProvider({
	consumerName: "useMoonService",
	Context: MoonServiceContext,
	getValue: createMoonServiceState,
	providerName: "Moon"
});
