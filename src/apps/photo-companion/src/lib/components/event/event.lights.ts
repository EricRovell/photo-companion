import { Bulb } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";
import type { LightsEvent } from "types";

export function lightsEventComponent(event: LightsEvent): EventComponent<{ glow: boolean }> {
	return {
		component: Bulb,
		props: {
			glow: event.name === "LIGHTS_START"
		},
		message: dict.CITIES[event.data.city],
		title: dict.LIGHTS_EVENTS[event.name],
		type: "lights"
	};
}
