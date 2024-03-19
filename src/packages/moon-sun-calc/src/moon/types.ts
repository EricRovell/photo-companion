import type { Coordinates } from "../types";
import type { MoonPhaseName } from "@shared/types";

export interface MoonCoordinates extends Coordinates {
	distance: number;
}

export interface MoonIllumination {
	/**
	 * The midpoint angle in radians of the illuminated limb of the moon
	 * reckoned eastward from the north point of the disk;
	 */
	angle: number;
	fraction: number;
	phase: MoonPhase;
	phaseValue: number;
}

export interface MoonPhase {
	id: MoonPhaseName;
	from: number;
	to: number;
	weight: number;
}

export interface MoonPosition {
	azimuth: number;
	altitude: number;
	distance: number;
	parallacticAngle: number;
}

export interface MoonTimes {
	rise: Nullish<Date>;
	set: Nullish<Date>;
	alwaysUp: boolean;
	alwaysDown: boolean;
	/**
	 * Date of the highest position.
	 * Avalílable if `set` and `rise` is not `null`.
	 */
	highest?: Date;
}
