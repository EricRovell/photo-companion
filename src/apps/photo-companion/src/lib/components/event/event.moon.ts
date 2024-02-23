import { Moon } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";
import type { MoonEvent } from "@shared/types";

export function moonEventComponent(event: MoonEvent): EventComponent<{ phase: number, rotation: number }> {
	return {
		component: Moon,
		props: {
			phase: event.data.phase,
			rotation: event.data.zenithAngle
		},
		message: `${event.data.waxing ? dict.LABEL.WAXING : dict.LABEL.WANING}, ${event.data.fraction}%`,
		title: dict.MOON_TIMES[event.name],
		type: "moon"
	};
}
