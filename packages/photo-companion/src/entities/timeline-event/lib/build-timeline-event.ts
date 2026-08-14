import { useTranslation } from "~/features/translation";

import { bridgeEventComponent } from "./timeline-event-bridge";
import { lightsEventComponent } from "./timeline-event-lights";
import { moonEventComponent } from "./timeline-event-moon";
import { sunEventComponent } from "./timeline-event-sun";
import { isBridgeEvent, isLightsEvent, isMoonEvent, isSunEvent } from "./validators";

import type { TimelineEvent } from "../types";

export function buildEventComponent(event: TimelineEvent) {
	const { t } = useTranslation();

	if (isBridgeEvent(event)) {
		return bridgeEventComponent(event, t());
	}

	if (isLightsEvent(event)) {
		return lightsEventComponent(event, t());
	}

	if (isMoonEvent(event)) {
		return moonEventComponent(event, t());
	}

	if (isSunEvent(event)) {
		return sunEventComponent(event, t());
	}

	throw new Error(`Unknown event is provided: ${JSON.stringify(event)}`);
}
