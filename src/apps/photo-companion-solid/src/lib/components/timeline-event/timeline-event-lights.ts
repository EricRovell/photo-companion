import { Bulb } from "../bulb/bulb";
import type { EventComponent } from "@lib/types";
import type { LightsEvent } from "types";
import type { Translation } from "@stores/lang";

export function lightsEventComponent(event: LightsEvent, t: Translation): EventComponent<{ glow: boolean }> {
	return {
		component: Bulb,
		props: {
			glow: event.name === "LIGHTS_START"
		},
		message: t.CITIES[event.data.city],
		title: t.LIGHTS_EVENTS[event.name],
		type: "lights"
	};
}
