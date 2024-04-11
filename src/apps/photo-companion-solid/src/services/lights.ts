import { settings } from "@stores/settings";
import { initLightsProvider } from "lights-schedule";
import { createMemo, createRoot } from "solid-js";

export function useLightsProvider() {
	const provider = createRoot(() => {
		const provider = createMemo(() => initLightsProvider(settings().lights_city));
		return provider;
	});

	return {
		provider
	};
}
