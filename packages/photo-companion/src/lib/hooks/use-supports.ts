import { isSupportedCity } from "lights-schedule";

import { useSettings } from "@lib/context/settings";

export function useSupportsLights() {
	const { getSettings } = useSettings();
	const supports = () => isSupportedCity(getSettings().city);

	return supports;
}

export function useSupportsBridges() {
	const { getSettings } = useSettings();
	const supportsBridges = () => getSettings().city === "SAINT_PETERSBURG";

	return supportsBridges;
}
