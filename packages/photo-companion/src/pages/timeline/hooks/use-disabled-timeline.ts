import { useSettings } from "~/features/settings";

export function useDisabledTimeline() {
	const { settings } = useSettings();

	return () => [
		settings.events_bridges_spb,
		settings.events_lights,
		settings.events_moon,
		settings.events_sun
	].some(check => check);
}
