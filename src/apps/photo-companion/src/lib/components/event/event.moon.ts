import type { MoonEvent } from "@shared/types";
import { template } from "@shared/utils";

import { Moon } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";

export function moonEventComponent(event: MoonEvent): EventComponent<{ phase: number, rotation: number }> {
	const { azimuth, phase, zenithAngle, waxing, fraction } = event.data;

	const message = template("{type} {fraction}%, {azimuth}°", {
		type: waxing ? dict.LABEL.WAXING : dict.LABEL.WANING,
		fraction,
		azimuth
	});

	return {
		component: Moon,
		props: {
			phase,
			rotation: zenithAngle
		},
		message: message,
		title: dict.MOON_TIMES[event.name],
		type: "moon"
	};
}
