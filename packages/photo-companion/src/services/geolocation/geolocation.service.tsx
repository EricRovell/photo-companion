import { createContext, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { ParentProps} from "solid-js";

import { createGeolocationState } from "./geolocation.state";

const GeolocationServiceContext = createContext<ReturnType<typeof createGeolocationState>>();

export function GeolocationProvider(props: ParentProps) {
	const state = createGeolocationState();

	return (
		<GeolocationServiceContext.Provider value={state}>
			{props.children}
		</GeolocationServiceContext.Provider>
	);
}

export function useGeolocationService() {
	const value = useContext(GeolocationServiceContext);

	if (isNullable(value)) {
		throw new Error("useGeolocationService must be used with a GeolocationServiceContext.Provider");
	}

	return value;
}
