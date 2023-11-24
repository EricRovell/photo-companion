import { Sun } from "@lib/components";
import { dict } from "@lib/dict";
import type { SunEvent, EventComponent, SunEventName } from "@lib/types";

export function sunEventComponent(event: SunEvent): EventComponent<{ event: SunEventName, elevation: number }> {
	let message: string | undefined = undefined;

	switch (event.name) {
		case "sunrise:start":
		case "sunset:end":
			message= `${event.data.azimuth}°, ${dict[`${event.name}:info`]}`;
			break;
		case "dawn:blue-hour:start":
		case "dawn:blue-hour:end":
		case "solar-noon":
		case "dusk:golden-hour:end":
		case "dusk:blue-hour:end":
			break;
		default:
			message = dict[`${event.name}:info`];
	}

	return {
		component: Sun,
		props: {
			event: event.name,
			elevation: event.data.elevation
		},
		message,
		title: dict[event.name]
	};
}
