import { SUN_EVENT_NAMES } from "@lib/constants";
import type { MoonEvent, SunEvent } from "@lib/types";
import type { LightsEvent, SunEventName, TimelineEvent } from "@shared/types";

export function isMoonEvent(event: TimelineEvent): event is MoonEvent {
	return event.name.startsWith("moon");
}

export function isLightsEvent(event: TimelineEvent): event is LightsEvent {
	return event.name.startsWith("lights");
}

export function isSunEvent(event: TimelineEvent): event is SunEvent {
	return SUN_EVENT_NAMES.includes(event.name as SunEventName);
}
