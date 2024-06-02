import type { LightsEvent } from "types";

import { Bulb } from "../bulb/bulb";

import type { Translation } from "@lib/context";
import type { EventComponent } from "@lib/types";

export function lightsEventComponent(event: LightsEvent, t: Translation): EventComponent<{ glow: boolean }> {
	return {
		component: Bulb,
		message: t.CITIES[event.data.city],
		props: {
			glow: event.name === "LIGHTS_START"
		},
		title: t.LIGHTS_EVENTS[event.name],
		type: "lights"
	};
}
