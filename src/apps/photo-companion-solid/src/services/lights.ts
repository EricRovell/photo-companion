import { settings } from "@stores/settings";
import { initLightsProvider } from "lights-schedule";
import { createMemo } from "solid-js";

export function useLightsProvider() {
	const provider = createMemo(() => initLightsProvider(settings().lights_city));

	return {
		provider
	};
}
