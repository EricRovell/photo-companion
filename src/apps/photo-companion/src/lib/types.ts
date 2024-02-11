import type { LightsCity, SunEventName, MoonEventName, LightsEventName } from "@shared/types";
import type { ComponentType } from "svelte";

export type EventGroupName =
	// TODO: add bridge events | "bridges"
	| "lights"
	| "moon"
	| "sun";

export interface ScheduleDataItem {
	lights: boolean;
	event: LightsEventName;
	timestamp: number
}

export type EventName =
	| LightsEventName
	| SunEventName
	| MoonEventName;

export interface Event<Name extends string, Data = Partial<Record<string, never>>> {
	name: Name;
	timestamp: number;
	data: Data;
}

export type LightsEvent = Event<LightsEventName>;

export type MoonEvent = Event<MoonEventName, {
	phase: number,
	waxing: boolean,
	fraction: number;
	zenithAngle: number;
}>;

export type SunEvent = Event<SunEventName, {
	azimuth: number,
	elevation: number;
}>;

export type TimelineEvent = LightsEvent | MoonEvent | SunEvent;

export interface TimelineEntry {
	date: Date;
	items: TimelineEvent[];
}

export interface EventComponent<Props> {
	component: ComponentType;
	props: Props;
	message?: string;
	title: string;
	type: "lights" | "moon" | "sun";
}

/**
 * Events:
 * 
 * `key` is an event group name.
 * 
 *  `value` is:
 *  1. Empty array — all events are allowed for this group;
 *  2. `null` — all events are forbidden for this group;
 *  3. Non-empty array — the forbidden events are listed.
 */
export interface SettingsStore {
	"bridges-spb": "navigation" | "always" | null;
	"events-lights": LightsEventName[] | null;
	"events-moon": MoonEventName[] | null;
	"events-sun": SunEventName[] | null;
	"latitude": number;
	"lights-city"?: Nullable<LightsCity>;
	"longitude": number;
	"starting-page": string;
}
