import type { LightsCity, SunEventName } from "@shared/types";
import type { ComponentType } from "svelte";

export type MoonPhaseName =
	| "new-moon"
	| "waxing-crescent"
	| "first-quarter"
	| "waxing-gibbous"
	| "full-moon"
	| "waning-gibbous"
	| "third-quarter"
	| "waning-crescent";

export type MoonEventName =
	| "moonrise"
	| "moonset";

export type LightsEventName =
	| "lights:start"
	| "lights:end";

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

export interface SettingsStore {
	"latitude": number;
	"lights-city"?: Nullable<LightsCity>;
	"longitude": number;
}
