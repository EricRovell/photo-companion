export type SunlightPhase = "astronomical" | "blue" | "civil" | "daylight" | "golden" | "nautical" | "night";

export interface SunlightInterval {
	end: number;
	phase: SunlightPhase;
	start: number;
}

export interface SunlightTransition {
	phase: SunlightPhase;
	timestamp: number;
}

export interface SunlightPeriod extends SunlightInterval {
	period: "evening" | "morning";
}

export interface SunlightMarker {
	timestamp: number;
	type: "sunrise" | "sunset";
}

export interface SunlightTick {
	major: boolean;
	progress: number;
	timestamp: number;
}

export interface SunlightDay {
	end: number;
	intervals: SunlightInterval[];
	markers: SunlightMarker[];
	periods: SunlightPeriod[];
	start: number;
}

export interface SunlightWidgetProps {
	date: Date;
	latitude: number;
	longitude: number;
}
