import type {
	BridgeEvent,
	LightsEvent,
	MoonEvent,
	SunEvent,
	TimelineEvent
} from "types";

export function isBridgeEvent(event: TimelineEvent): event is BridgeEvent {
	return event.type === "BRIDGE";
}

export function isLightsEvent(event: TimelineEvent): event is LightsEvent {
	return event.type === "LIGHTS";
}

export function isMoonEvent(event: TimelineEvent): event is MoonEvent {
	return event.type === "MOON";
}

export function isSunEvent(event: TimelineEvent): event is SunEvent {
	return event.type === "SUN";
}
