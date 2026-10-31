import type { Accessor, JSX } from "solid-js";

import type { BelowHorizonInterval } from "~/shared/lib/rise-set";

export interface RiseSetEventData {
	date: Nullish<Date>;
	day: string;
	label: string;
	time: string;
}

export type RiseSetTimeRenderer = (date: Date, children: JSX.Element, label: string) => JSX.Element;

export interface RiseSetWidgetProps {
	aboveHorizon: boolean;
	belowHorizonInterval?: BelowHorizonInterval;
	date: Date;
	entity: "moon" | "sun";
	getTimerTimestamp?: Accessor<number>;
	nextRise?: Nullish<Date>;
	renderTime?: RiseSetTimeRenderer;
	rise: Nullish<Date>;
	set: Nullish<Date>;
}
