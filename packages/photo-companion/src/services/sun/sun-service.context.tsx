import { createContext, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { ParentProps} from "solid-js";

import { createSunState } from "./sun-service.state";

const SunServiceContext = createContext<ReturnType<typeof createSunState>>();

export function SunProvider(props: ParentProps) {
	const state = createSunState();

	return (
		<SunServiceContext.Provider value={state}>
			{props.children}
		</SunServiceContext.Provider>
	);
}

export function useSunService() {
	const value = useContext(SunServiceContext);

	if (isNullable(value)) {
		throw new Error("useSunService must be used with a SunServiceContext.Provider");
	}

	return value;
}
