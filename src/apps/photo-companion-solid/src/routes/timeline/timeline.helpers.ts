import type { SettingsStore } from "@lib/stores/settings";

export function hasSomeEvents(settings: SettingsStore) {
	const { events_bridges_spb, events_lights, events_moon, events_sun } = settings;

	return [ events_bridges_spb, events_lights, events_moon, events_sun ]
		.some(check => check);
}
