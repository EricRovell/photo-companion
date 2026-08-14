import type { Component } from "solid-js";
import type {
	BridgeEvent,
	Event,
	LightsEvent
} from "types";

import type { MoonEventName } from "~/entities/moon/types";
import type { SunEventName } from "~/entities/sun/types";

export type EventGroupName =
	| "BRIDGE"
	| "LIGHTS"
	| "MOON"
	| "SUN";

export type MoonEvent = Event<"MOON", MoonEventName, {
	azimuth: string;
	fraction: string;
	phase: number,
	rotation: number;
	waxing: boolean,
}>;

export type SunEvent = Event<"SUN", SunEventName, {
	azimuth: string
}>;

export type TimelineEvent =
	BridgeEvent |
	LightsEvent |
	MoonEvent |
	SunEvent;

export type EventName = TimelineEvent["name"];

export interface EventComponent<Props> {
	component: Component<Props>;
	message?: string;
	props: Props;
	title: string;
	type?: "bridge" | "lights" | "moon" | "sun";
}
