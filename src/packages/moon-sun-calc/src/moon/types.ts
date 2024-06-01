import type { MoonPhaseName } from "types";

import type { Coordinates } from "../types";

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
	from: number;
	id: MoonPhaseName;
	to: number;
	weight: number;
}

export interface MoonPosition {
	altitude: number;
	azimuth: number;
	distance: number;
	parallacticAngle: number;
}

export interface MoonTimes {
	alwaysDown: boolean;
	alwaysUp: boolean;
	/**
	 * Date of the highest position.
	 * Available if `set` and `rise` is not `null`.
	 */
	highest?: Date;
	rise: Nullish<Date>;
	set: Nullish<Date>;
}
