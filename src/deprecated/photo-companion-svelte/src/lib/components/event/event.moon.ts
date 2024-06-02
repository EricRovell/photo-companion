import type { MoonEvent } from "types";
import { template } from "utils/formatters";

import { Moon } from "@lib/components";
import type { EventComponent } from "@lib/types";
import type { Translation } from "@stores/lang";

export function moonEventComponent(event: MoonEvent, t: Translation): EventComponent<{ phase: number, rotation: number }> {
	const { azimuth, phase, rotation, waxing, fraction } = event.data;

	const message = template("{type} {fraction} / {azimuth}", {
		type: waxing ? t.LABEL.WAXING : t.LABEL.WANING,
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
		title: t.MOON_TIMES[event.name],
		type: "moon"
	};
}
