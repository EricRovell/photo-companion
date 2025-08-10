import { createContext } from "solid-js";

import { createProvider } from "~/shared/lib/create-provider";

import { createGeolocationState } from "./model";

const GeolocationServiceContext = createContext<ReturnType<typeof createGeolocationState>>();

export const [ GeolocationProvider, useGeolocationService ] = createProvider({
	consumerName: "useGeolocationService",
	Context: GeolocationServiceContext,
	getValue: createGeolocationState,
	providerName: "Geolocation"
});
