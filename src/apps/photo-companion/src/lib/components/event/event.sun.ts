import { Sun } from "@lib/components";
import { dict } from "@lib/dict";
import type { SunEventName } from "@shared/types";
import type { SunEvent, EventComponent } from "@lib/types";

export function sunEventComponent(event: SunEvent): EventComponent<{ event: SunEventName, elevation: number }> {
	let message: string | undefined = undefined;

	switch (event.name) {
		case "sunrise:start":
		case "sunset:end":
			message= `${event.data.azimuth}°, ${dict[`${event.name}:title`]}`;
			break;
		case "blue-hour:dawn:start":
		case "blue-hour:dawn:end":
		case "solar-noon":
		case "golden-hour:dusk:end":
		case "blue-hour:dusk:end":
			break;
		default:
			message = dict[`${event.name}:title`];
	}

	return {
		component: Sun,
		props: {
			event: event.name,
			elevation: event.data.elevation
		},
		message,
		title: dict[event.name],
		type: "sun"
	};
}
