import { createContext, DEV, onSettled, type ParentProps, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import { createContextState } from "./service-worker-model";

const ServiceWorkerContext = createContext<ReturnType<typeof createContextState>>();

export function ServiceWorkerProvider(props: ParentProps) {
	const state = createContextState();

	onSettled(() => {
		if (!DEV) {
			void state.initServiceWorker();
		}
	});

	return (
		<ServiceWorkerContext value={state}>
			{props.children}
		</ServiceWorkerContext>
	);
}

export function useServiceWorker() {
	const value = useContext(ServiceWorkerContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a ServiceWorker.Provider");
	}

	return value;
}
