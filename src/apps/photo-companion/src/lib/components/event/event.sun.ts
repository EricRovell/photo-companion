import { Sun } from "@lib/components";
import { dict } from "@lib/dict";
import type { EventComponent } from "@lib/types";
import type { SunEventName, SunEvent } from "@shared/types";

export function sunEventComponent(event: SunEvent): EventComponent<{ event: SunEventName, elevation: number }> {
	let message: string | undefined = undefined;

	switch (event.name) {
		case "SUNRISE_START":
		case "SUNSET_END":
			message= `${event.data.azimuth}°, ${dict.SUN_TIMES[`${event.name}_TITLE`]}`;
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
