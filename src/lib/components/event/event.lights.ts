import { Bulb } from "@lib/components";
import { dict } from "@lib/dict";
import type { LightsEvent, EventComponent } from "@lib/types";

export function lightsEventComponent(event: LightsEvent): EventComponent<{ glow: boolean }> {
	return {
		component: Bulb,
		props: {
			glow: event.name === "lights:start"
		},
		message: dict["saint-petersburg"],
		title: dict[event.name]
	};
}
