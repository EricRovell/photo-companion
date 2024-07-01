import type {
	BridgeEventName,
	EventName,
	LightsEventName,
	MoonEventName,
	SunEventName,
	TimelineEvent
} from "types";

export interface Options {
	comparator: (a: TimelineEvent, b: TimelineEvent) => number;
	bridgeEvents: Nullish<BridgeEventName[]>;
	lightsEvents: Nullish<LightsEventName[]>;
	moonEvents: Nullish<MoonEventName[]>;
	predicate: (event: TimelineEvent) => boolean;
	sunEvents: Nullish<SunEventName[]>;
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
