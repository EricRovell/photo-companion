import { createContext } from "solid-js";

import { createProvider } from "~/shared/lib/create-provider";

import { createNavigationService } from "./navigation";

export type { ROUTE_PRIMARY_LABEL, ROUTE_VALUE } from "../consts";

const NavigationServiceContext = createContext<ReturnType<typeof createNavigationService>>();

export const [ NavigationServiceProvider, useNavigationService ] = createProvider({
	consumerName: "useNavigationService",
	Context: NavigationServiceContext,
	getValue: createNavigationService,
	providerName: "NavigationService"
});
