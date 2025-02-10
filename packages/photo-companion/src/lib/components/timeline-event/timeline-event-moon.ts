import { template } from "utils/formatters";

import type { MoonEvent } from "types";

import { Moon } from "../moon/moon";

import type { EventComponent } from "~/lib/types";
import type { Translation } from "~/services/translation";

export function moonEventComponent(event: MoonEvent, t: Translation): EventComponent<{ phase: number, rotation: number }> {
	const { azimuth, fraction, phase, rotation, waxing } = event.data;

	const message = template("{type} {fraction} / {azimuth}", {
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
