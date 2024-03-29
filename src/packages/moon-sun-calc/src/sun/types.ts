import type { SunEventName } from "types";
export type { SunEventName } from "types";
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
	/**
	 * Note: exception for `SOLAR_NOON` & `NADIR`
	 */
	elevation?: number;
	julian: number;
	index: number;
	name: string;
	timestamp: number;
	valid: boolean;
}
