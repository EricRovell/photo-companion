import { template } from "utils/formatters";

import type { MoonEvent } from "types";

import { Moon } from "../moon/moon";

import type { Translation } from "~/lib/context/translation";
import type { EventComponent } from "~/lib/types";

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
