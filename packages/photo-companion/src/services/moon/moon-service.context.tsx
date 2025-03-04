import { createContext, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { ParentProps} from "solid-js";

import { createMoonServiceState } from "./moon-service.state";

const MoonServiceContext = createContext<ReturnType<typeof createMoonServiceState>>();

export function MoonProvider(props: ParentProps) {
	const state = createMoonServiceState();

	return (
		<MoonServiceContext.Provider value={state}>
			{props.children}
		</MoonServiceContext.Provider>
	);
}

export function useMoonService() {
	const value = useContext(MoonServiceContext);

	if (isNullable(value)) {
		throw new Error("useMoonService must be used with a MoonServiceContext.Provider");
	}

	return value;
}
