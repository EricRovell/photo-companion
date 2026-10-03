import type { SeasonEvent } from "moon-sun-calc";

export interface SeasonGraphPoint {
	x: number;
	y: number;
}

export interface SeasonGraphRange {
	end: number;
	start: number;
}

export interface SeasonGraphEventPoint {
	event: SeasonEvent;
	point: SeasonGraphPoint;
}

export interface SeasonGraphProps {
	datetime: Date;
	events: SeasonEvent[];
}
