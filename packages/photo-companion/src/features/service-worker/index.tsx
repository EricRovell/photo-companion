import { createContext, DEV, onMount, type ParentProps, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import { createContextState } from "./model";

const ServiceWorkerContext = createContext<ReturnType<typeof createContextState>>();

export function ServiceWorkerProvider(props: ParentProps) {
	const state = createContextState();

	onMount(() => {
		if (!DEV) {
			void state.initServiceWorker();
		}
	});

	return (
		<ServiceWorkerContext.Provider value={state}>
			{props.children}
		</ServiceWorkerContext.Provider>
	);
}

export function useServiceWorker() {
	const value = useContext(ServiceWorkerContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a ServiceWorker.Provider");
	}

	return value;
}
