import type { SunEventName, SunEvent } from "@shared/types";
import { template } from "utils/formatters";

import { Sun } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";

export function sunEventComponent(event: SunEvent): EventComponent<{ event: SunEventName, elevation: string }> {
	let message: string | undefined = undefined;

	switch (event.name) {
		case "SUNRISE_START":
		case "SUNRISE_END":
		case "SUNSET_START":
		case "SUNSET_END":
			message = template("{event}, {azimuth}", {
				event: dict.SUN_TIMES[`${event.name}_TITLE`],
				azimuth: event.data.azimuth
			});
			break;
		case "BLUE_HOUR_START_DAWN":
		case "BLUE_HOUR_END_DAWN":
		case "SOLAR_NOON":
		case "GOLDEN_HOUR_END_DUSK":
		case "BLUE_HOUR_END_DUSK":
			break;
		default:
			message = dict.SUN_TIMES[`${event.name}_TITLE`];
	}

	return {
		component: Sun,
		props: {
			event: event.name,
			elevation: event.data.elevation
		},
		message,
		title: dict.SUN_TIMES[event.name],
		type: "sun"
	};
}
