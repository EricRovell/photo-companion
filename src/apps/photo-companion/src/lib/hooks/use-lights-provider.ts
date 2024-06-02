import { initLightsProvider } from "lights-schedule";
import { createMemo } from "solid-js";

import { useSettings } from "@lib/context";

export function useLightsProvider() {
	const { getSettings } = useSettings();
	const getLightsProvider = createMemo(() => initLightsProvider(getSettings().lights_city));

	return {
		getLightsProvider
	};
}
