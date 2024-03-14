import { getBridgeEvents } from "bridge-schedule";
import { initLightsProvider } from "lights-schedule";
import { isNullable } from "utils/validators";

import { settingsStore as store } from "@lib/stores";
import { provider as lightsProvider } from "../lights";
import { getSunEvents } from "../sun";
import { getMoonEvents } from "../moon";
import type { EventProviderByDate, EventProviderByLocation } from "./types";

export const EVENT_PROVIDERS: Array<EventProviderByDate | EventProviderByLocation> = [
	[ "LOCATION", getMoonEvents, "moon" ],
	[ "LOCATION", getSunEvents, "sun" ],
	[ "DATE", getBridgeEvents, "bridge" ],
	[ "DATE", lightsProvider?.getEventsByDate, "lights" ]
];

store.subscribe(value => {
	if (isNullable(value)) {
		return;
	}

	const lightsProvider = initLightsProvider(value.lights_city);

	EVENT_PROVIDERS[3][1] = lightsProvider?.getEventsByDate;
});
