import { Moon } from "~/entities/moon";

import type { EventComponent, MoonEvent } from "../types";
import type { MessageFormatter, Translation } from "~/features/translation";

export function moonEventComponent(
	event: MoonEvent,
	t: Translation,
	messageFormatter: MessageFormatter
): EventComponent<{ phase: number, rotation: number }> {
	const { azimuth, fraction, phase, rotation, waxing } = event.data;

	const message = messageFormatter(t.TIMELINE_EVENT.MOON_DESCRIPTION, {
		azimuth,
		fraction,
		type: waxing ? t.LABEL.WAXING : t.LABEL.WANING
	});

	return {
		component: Moon,
		message: message,
		props: {
			phase,
			rotation
		},
		title: t.MOON_TIMES[event.name],
		type: "moon"
	};
}
