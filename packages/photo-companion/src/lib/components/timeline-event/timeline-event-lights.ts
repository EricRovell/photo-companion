import type { LightsEvent } from "types";

import { Bulb } from "../bulb/bulb";

import type { EventComponent } from "~/lib/types";
import type { Translation } from "~/services/translation";

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
