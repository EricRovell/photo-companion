import { Moon } from "@lib/components";
import { dict } from "@lib/dict";
import type { MoonEvent, EventComponent } from "@lib/types";

export function moonEventComponent(event: MoonEvent): EventComponent<{ phase: number}> {
	return {
		component: Moon,
		props: {
			phase: event.data.phase
		},
		message: `${event.data.waxing ? dict["waxing"] : dict["waning"]}, ${event.data.fraction * 100}%`,
		title: dict[event.name]
	};
}
