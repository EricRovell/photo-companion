import { Sun } from "@lib/components";
import { dict } from "@lib/dict";
import type { SunEvent, EventComponent, SunEventName } from "@lib/types";

export function sunEventComponent(event: SunEvent): EventComponent<{ event: SunEventName }> {

	return {
		component: Sun,
		props: {
			event: event.name
		},
		message: dict[`${event.name}:info`],
		title: dict[event.name]
	};
}
