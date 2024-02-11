import { SUN_EVENT_NAMES } from "@lib/constants";
import type { MoonEvent, SunEvent } from "@lib/types";
import type { LightsEvent, SunEventName, TimelineEvent } from "@shared/types";

const SUN_EVENT_NAMES_SET = new Set(SUN_EVENT_NAMES);

export function isMoonEvent(event: TimelineEvent): event is MoonEvent {
	return event.name.startsWith("MOON");
}

export function isLightsEvent(event: TimelineEvent): event is LightsEvent {
	return event.name.startsWith("LIGHTS");
}

export function isSunEvent(event: TimelineEvent): event is SunEvent {
	return SUN_EVENT_NAMES_SET.has(event.name as SunEventName);
}
