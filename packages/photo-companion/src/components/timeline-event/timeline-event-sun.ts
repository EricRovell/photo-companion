import { template } from "utils/formatters";

import type { SunEvent, SunEventName } from "types";

import { Sun } from "../sun/sun";

import type { Translation } from "~/services/translation";
import type { EventComponent } from "~/types";

export function sunEventComponent(event: SunEvent, t: Translation): EventComponent<{ event: SunEventName }> {
	let message: Undefinable<string> = undefined;

	switch (event.name) {
		case "SUNRISE_START":
		case "SUNRISE_END":
		case "SUNSET_START":
		case "SUNSET_END":
			message = template("{event}, {azimuth}", {
				azimuth: event.data.azimuth,
				event: t.SUN_TIMES[`${event.name}_TITLE`]
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
		message,
		props: {
			event: event.name
		},
		title: t.SUN_TIMES[event.name],
		type: "sun"
	};
}
