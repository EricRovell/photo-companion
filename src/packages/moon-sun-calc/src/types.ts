import type { MoonPhaseName, SunEventName } from "@shared/types";
export type { SunEventName } from "@shared/types";

export interface SunTime {
	// The Name of the time
	name: string;
	// Date object with the calculated sun-time
	value: Date;
	// The time as timestamp
	ts: number;
	// The position of the sun on the time
	pos: number;
	// Angle of the sun on the time (except for solarNoon / nadir)
	elevation?: number;
	// The time as Julian calendar
	julian: number;
	// indicates if the time is valid or not
	valid: boolean;
}

export interface SunPosition {
	altitude: number;
	azimuth: number;
	declination: number;
	zenith: number;
}

export interface MoonPosition {
	azimuth: number;
	altitude: number;
	distance: number;
	parallacticAngle: number;
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

export interface SunTimeEvent {
	angle: number;
	riseName: SunEventName;
	setName: SunEventName
}

export interface MoonTimes {
	rise: Date | null;
	set: Date | null;
	alwaysUp: boolean;
	alwaysDown: boolean;
	// Date of the highest position, only avalílable if set and rise is not NaN
	highest?: Date;
}

export interface SunCoordinates {
	// The declination of the sun
	dec: number;
	// The right ascension of the sun
	ra: number;
}
