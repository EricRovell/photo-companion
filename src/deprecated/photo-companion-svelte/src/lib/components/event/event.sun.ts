import type { SunEventName, SunEvent } from "types";
import { template } from "utils/formatters";

import { Sun } from "@lib/components";
import type { EventComponent } from "@lib/types";
import type { Translation } from "@stores/lang";

export function sunEventComponent(event: SunEvent, t: Translation): EventComponent<{ event: SunEventName }> {
	let message: Undefinable<string> = undefined;

	switch (event.name) {
		case "SUNRISE_START":
		case "SUNRISE_END":
		case "SUNSET_START":
		case "SUNSET_END":
			message = template("{event}, {azimuth}", {
				event: t.SUN_TIMES[`${event.name}_TITLE`],
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
			message = t.SUN_TIMES[`${event.name}_TITLE`];
	}

	return {
		component: Sun,
		props: {
			event: event.name
		},
		message,
		title: t.SUN_TIMES[event.name],
		type: "sun"
	};
}
