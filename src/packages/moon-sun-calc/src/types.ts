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
	// The azimuth above the horizon of the sun in radians
	azimuth: number;
	// The altitude of the sun in radians
	altitude: number;
	// The zenith of the sun in radians
	zenith: number;
	// The azimuth of the sun in decimal degree
	azimuthDegrees: number;
	// The altitude of the sun in decimal degree
	altitudeDegrees: number;
	// The zenith of the sun in decimal degree
	zenithDegrees: number;
	// The declination of the sun
	declination: number;
}

export interface MoonPosition {
	// The moon azimuth in radians
	azimuth: number;
	// The moon altitude above the horizon in radians
	altitude: number;
	// The moon azimuth in degree
	azimuthDegrees: number;
	// The moon altitude above the horizon in degree
	altitudeDegrees: number;
	// The distance of the moon to the earth in kilometers
	distance: number;
	// The parallactic angle of the moon
	parallacticAngle: number;
	// The parallactic angle of the moon in degree
	parallacticAngleDegrees: number;
}

export interface DateObject {
	// The Date as a ISO String YYYY-MM-TTTHH:MM:SS.mmmmZ
	date: string;
	// The Date as the milliseconds since 1.1.1970 0:00 UTC
	value: number;
}

export interface MoonIlluminationDates {
	// The Date as a ISO String YYYY-MM-TTTHH:MM:SS.mmmmZ of the next phase
	date: string;
	// The Date as the milliseconds since 1.1.1970 0:00 UTC of the next phase
	value: number;
	// The name of the next phase [newMoon, fullMoon, firstQuarter, thirdQuarter]
	type: string;
	// Date of the next new moon
	newMoon: DateObject;
	// Date of the next full moon
	fullMoon: DateObject;
	// Date of the next first quater of the moon
	firstQuarter: DateObject;
	// Date of the next third/last quater of the moon
	thirdQuarter: DateObject;
}

export interface MoonData {
	// The moon azimuth in radians
	azimuth: number;
	// The moon altitude above the horizon in radians
	altitude: number;
	// The moon azimuth in degrees
	azimuthDegrees: number;
	// The moon altitude above the horizon in degree
	altitudeDegrees: number;
	// The distance of the moon to the earth in kilometers
	distance: number;
	// The parallactic angle of the moon
	parallacticAngle: number;
	// The parallactic angle of the moon in degree
	parallacticAngleDegrees: number;
	// The zenith angle of the moon
	zenithAngle: number;
	// object containing information about the next phases of the moon
	illumination: MoonIllumination;
}

export interface MoonIllumination {
	// illuminated fraction of the moon; varies from `0.0` (new moon) to `1.0` (full moon)
	fraction: number;
	// moon phase as object
	phase: MoonPhase;
	// The phase of the moon in the current cycle; varies from `0.0` to `1.0`
	phaseValue: number;
	// The midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk;
	angle: number;
	next: MoonIlluminationDates;
}

export interface MoonPhase {
	// The phase start
	from: number;
	// The phase end
	to: number;
	// id of the phase
	id: MoonPhaseName;
	// name of the phase
	weight: number;
}

export interface SunTimeEvent {
	angle: number;
	riseName: SunEventName;
	setName: SunEventName
}

export interface MoonTimes {
	// a Date object if the moon is rising on the given Date, otherwise NaN
	rise: Date | typeof NaN;
	// a Date object if the moon is setting on the given Date, otherwise NaN
	set: Date | typeof NaN;
	// is true if the moon never rises/sets and is always _above_ the horizon during the day
	alwaysUp: boolean;
	//  is true if the moon is always _below_ the horizon
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
