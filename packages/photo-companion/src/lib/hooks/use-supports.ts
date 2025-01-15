import { isSupportedCity } from "lights-schedule";

import { useSettings } from "@lib/context/settings";

export function useSupportsLights() {
	const { settings } = useSettings();
	return () => isSupportedCity(settings.city);
}

export function useSupportsBridges() {
	const { settings } = useSettings();
	return () => settings.city === "SAINT_PETERSBURG";
}
