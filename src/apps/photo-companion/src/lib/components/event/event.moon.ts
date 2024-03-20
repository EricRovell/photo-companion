import type { MoonEvent } from "types";
import { template } from "utils/formatters";

import { Moon } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";

export function moonEventComponent(event: MoonEvent): EventComponent<{ phase: number, rotation: number }> {
	const { azimuth, phase, rotation, waxing, fraction } = event.data;

	const message = template("{type} {fraction} / {azimuth}", {
		type: waxing ? dict.LABEL.WAXING : dict.LABEL.WANING,
		fraction,
		azimuth
	});

	return {
		component: Moon,
		props: {
			phase,
			rotation
		},
		message: message,
		title: dict.MOON_TIMES[event.name],
		type: "moon"
	};
}
