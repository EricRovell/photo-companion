import type {
	BridgeEventName,
	EventName,
	LightsEventName,
	MoonEventName,
	SunEventName,
	TimelineEvent
} from "@shared/types";

export interface Options {
	comparator: (a: TimelineEvent, b: TimelineEvent) => number;
	bridgeEvents: BridgeEventName[] | null;
	lightsEvents: LightsEventName[] | null;
	moonEvents: MoonEventName[] | null;
	predicate: (event: TimelineEvent) => boolean;
	sunEvents: SunEventName[] | null;
	secondaryEvents?: Set<EventName>;
}

export type EventProviderByDate = [
	"DATE",
	Nullable<(date: Date) => TimelineEvent[]>,
	"lights" | "bridge"
];

export type EventProviderByLocation = [
	"LOCATION",
	(date: Date, latitude: number, longitude: number) => TimelineEvent[],
	"sun" | "moon"
];
