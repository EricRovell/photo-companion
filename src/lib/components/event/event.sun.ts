import { Sun } from "@lib/components";
import { dict } from "@lib/dict";
import type { SunEvent, EventComponent, SunEventName } from "@lib/types";

export function sunEventComponent(event: SunEvent): EventComponent<{ event: SunEventName, elevation: number }> {
	const message = (event.name === "sunrise:start" || event.name === "sunset:end")
		? `${event.data.azimuth}°, ${dict[`${event.name}:info`]}`
		: dict[`${event.name}:info`];

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
