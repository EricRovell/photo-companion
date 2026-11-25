import type { MoonPhaseName } from "moon-sun-calc";

export interface MoonCalendarDay {
	day: number;
	outsideMonth: boolean;
	phase: MoonCalendarPhase | null;
}

export interface MoonCalendarPhase {
	/** Fraction of the visible lunar disk illuminated at `timestamp`, from 0 to 1. */
	fraction: number;
	/** Identifier of the phase event or sampled phase, used for localized labels. */
	name: MoonPhaseName;
	/** Whether a new moon, first quarter, full moon, or third quarter occurs on this local date. */
	principal: boolean;
	/** Whether the ephemeris covers this local date through the following midnight, allowing selection. */
	selectable: boolean;
	/** Phase event time or sampled time (usually local noon), in Unix milliseconds. */
	timestamp: number;
	/**
	 * Position in the lunar cycle used to draw the icon, in the range [0, 1).
	 * New moon, first quarter, full moon, and third quarter use 0, 0.25, 0.5, and 0.75.
	 */
	value: number;
}
