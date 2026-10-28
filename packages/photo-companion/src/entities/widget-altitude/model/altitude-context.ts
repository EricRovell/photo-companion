import { createContext, createUniqueId, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import { createAltitudeState } from "./create-altitude-state";
import { createAltitudeToggle } from "./create-altitude-toggle";

import type { AltitudeWidgetProps } from "../types";

export function createAltitudeContext(props: AltitudeWidgetProps) {
	const toggle = createAltitudeToggle(() => props.entities);

	return {
		...createAltitudeState(props, toggle.isSelected),
		...toggle,
		id: createUniqueId(),
		props
	};
}

export const AltitudeContext = createContext<ReturnType<typeof createAltitudeContext>>();

export function useAltitudeContext() {
	const context = useContext(AltitudeContext);

	if (isNullable(context)) {
		throw new Error("AltitudeWidget components must be used within AltitudeWidget.");
	}

	return context;
}
