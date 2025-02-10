import { createContext, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { ParentProps} from "solid-js";

import { createNavigationService } from "./navigation.state";

export type { ROUTE_LABEL, ROUTE_PRIMARY_LABEL, ROUTE_VALUE, ROUTES_PRIMARY } from "./navigation-service.consts";

const NavigationServiceContext = createContext<ReturnType<typeof createNavigationService>>();

export function NavigationServiceProvider(props: ParentProps) {
	const state = createNavigationService();

	return (
		<NavigationServiceContext.Provider value={state}>
			{props.children}
		</NavigationServiceContext.Provider>
	);
}

export function useNavigationService() {
	const value = useContext(NavigationServiceContext);

	if (isNullable(value)) {
		throw new Error("useSettings must be used with a NavigationServiceContext.Provider");
	}

	return value;
}
