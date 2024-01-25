import { Bulb } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";
import type { LightsEvent } from "@shared/types";

export function lightsEventComponent(event: LightsEvent): EventComponent<{ glow: boolean }> {
	return {
		component: Bulb,
		props: {
			glow: event.name === "lights:start"
		},
		message: dict[event.data.city],
		title: dict[event.name],
		type: "lights"
	};
}
