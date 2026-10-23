import type { JSX } from "solid-js";

export interface RiseSetEventData {
	date: Nullish<Date>;
	day: string;
	label: string;
	time: string;
}

export type RiseSetTimeRenderer = (date: Date, children: JSX.Element, label: string) => JSX.Element;

export interface RiseSetWidgetProps {
	aboveHorizon: boolean;
	date: Date;
	entity: "moon" | "sun";
	renderTime?: RiseSetTimeRenderer;
	rise: Nullish<Date>;
	set: Nullish<Date>;
}
