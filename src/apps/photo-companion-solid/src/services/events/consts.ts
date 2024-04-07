import { getBridgeEvents } from "bridge-schedule";

import { useLightsProvider } from "../lights";
import { getSunEvents } from "../sun";
import { getMoonEvents } from "../moon";
import type { EventProviderByDate, EventProviderByLocation } from "./types";

export const EVENT_PROVIDERS: Array<EventProviderByDate | EventProviderByLocation> = [
	[ "LOCATION", getMoonEvents, "moon" ],
	[ "LOCATION", getSunEvents, "sun" ],
	[ "DATE", getBridgeEvents, "bridge" ],
	[ "DATE", useLightsProvider().provider().getEventsByDate, "lights" ]
];
