import type { EventOptions, Observer, UtcInterval } from "../types";

export interface RiseSetInterval {
	/** Null when the rise is outside the search interval or unavailable. */
	rise: Date | null;
	/** The following set; null when outside the search interval or unavailable. */
	set: Date | null;
}

export interface RiseSetSearchInput {
	/** Explicit half-open UTC search bounds; longer ranges are scanned in chunks. */
	interval: UtcInterval;
	observer: Observer;
	options?: EventOptions;
}

export interface RiseSetCrossing {
	direction: "rising" | "setting";
	time: Date;
}
