import type { SunEventName } from "@shared/types";
export type { SunEventName } from "@shared/types";
import type { Coordinates } from "../types";

export type SunCoordinates = Coordinates;

export interface SunPosition {
	altitude: number;
	azimuth: number;
	declination: number;
	zenith: number;
}

export interface SunTimeEvent {
	angle: number;
	riseName: SunEventName;
	setName: SunEventName
}

export interface SunTime {
	elevation?: number; // exception: SOLAR_NOON & NADIR
	julian: number;
	index: number;
	name: string;
	timestamp: number;
	valid: boolean;
}
