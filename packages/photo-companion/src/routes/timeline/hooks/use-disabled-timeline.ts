import { useSettings } from "@lib/context/settings";

export function useDisabledTimeline() {
	const { getSettings } = useSettings();
	const { events_bridges_spb, events_lights, events_moon, events_sun } = getSettings();

	return [
		events_bridges_spb,
		events_lights,
		events_moon,
		events_sun
	].some(check => check);
}
