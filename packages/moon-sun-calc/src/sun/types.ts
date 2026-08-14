import type { EquatorialCoordinates } from "../shared/types";
import type {
	DateLike,
	Degree,
	EventOptions,
	Observer,
	PositionOptions,
	UtcInterval
} from "../types";

export interface SunPosition extends EquatorialCoordinates {
	/** Center altitude without atmospheric refraction. */
	altitude: Degree;
	/** Center altitude with atmospheric refraction. */
	apparentAltitude: Degree;
	/** North = 0 degrees, east = 90 degrees. */
	azimuth: Degree;
	zenith: Degree;
}

export interface SunPositionInput {
	instant: DateLike;
	observer: Observer;
	options?: PositionOptions;
}

export interface Crossing {
	direction: "rising" | "setting";
	time: Date;
}

export interface AzimuthCrossing {
	altitude: Degree;
	apparentAltitude: Degree;
	time: Date;
}

export interface SunAltitudeCrossingsInput {
	altitude: Degree;
	interval: UtcInterval;
	observer: Observer;
	options?: EventOptions;
}

export interface SunAzimuthCrossingsInput {
	azimuth: Degree;
	interval: UtcInterval;
	observer: Observer;
	options?: EventOptions;
}

export type SunEventName =
	| "ASTRONOMICAL_DAWN"
	| "ASTRONOMICAL_DUSK"
	| "BLUE_HOUR_END_DAWN"
	| "BLUE_HOUR_END_DUSK"
	| "BLUE_HOUR_START_DAWN"
	| "BLUE_HOUR_START_DUSK"
	| "CIVIL_DAWN"
	| "CIVIL_DUSK"
	| "GOLDEN_HOUR_END_DAWN"
	| "GOLDEN_HOUR_END_DUSK"
	| "GOLDEN_HOUR_START_DAWN"
	| "GOLDEN_HOUR_START_DUSK"
	| "NADIR"
	| "NAUTICAL_DAWN"
	| "NAUTICAL_DUSK"
	| "SOLAR_NOON"
	| "SUNRISE_END"
	| "SUNRISE_START"
	| "SUNSET_END"
	| "SUNSET_START";

export interface SunEvent {
	altitude?: Degree;
	name: SunEventName;
	time: Date;
}

export interface SunEventsInput {
	interval: UtcInterval;
	observer: Observer;
	options?: EventOptions;
}

export type SunAltitudeEventDefinition = readonly [Degree, SunEventName, SunEventName];
