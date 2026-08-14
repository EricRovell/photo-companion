import type { EquatorialCoordinates } from "../shared/types";
import type {
	DateLike,
	Degree,
	EventOptions,
	Fraction,
	Kilometer,
	Millisecond,
	Observer,
	PositionOptions,
	UtcInterval
} from "../types";

export interface MoonPosition extends EquatorialCoordinates {
	/** Center altitude without atmospheric refraction. */
	altitude: Degree;
	/** Center altitude with atmospheric refraction. */
	apparentAltitude: Degree;
	/** North = 0 degrees, east = 90 degrees. */
	azimuth: Degree;
	distance: Kilometer;
	parallacticAngle: Degree;
	zenith: Degree;
}

export interface MoonPositionInput {
	instant: DateLike;
	observer: Observer;
	options?: PositionOptions;
}

export type MoonPhaseName =
	| "FIRST_QUARTER"
	| "FULL_MOON"
	| "NEW_MOON"
	| "THIRD_QUARTER"
	| "WANING_CRESCENT"
	| "WANING_GIBBOUS"
	| "WAXING_CRESCENT"
	| "WAXING_GIBBOUS";

export type PrincipalMoonPhaseName = Extract<
	MoonPhaseName,
	"FIRST_QUARTER" | "FULL_MOON" | "NEW_MOON" | "THIRD_QUARTER"
>;

export interface MoonIllumination {
	/** Bright-limb position angle, eastward from celestial north. */
	angle: Degree;
	fraction: Fraction;
	phase: MoonPhaseName;
	/** Lunation fraction: 0 new, 0.25 first quarter, 0.5 full. */
	phaseValue: Fraction;
	waxing: boolean;
}

export interface MoonPhaseEvent {
	phase: PrincipalMoonPhaseName;
	time: Date;
}

export type MoonEventName = "MOON_ANTITRANSIT" | "MOON_TRANSIT" | "MOONRISE" | "MOONSET";

export interface MoonEvent {
	name: MoonEventName;
	time: Date;
}

export interface MoonEventsInput {
	interval: UtcInterval;
	observer: Observer;
	options?: EventOptions;
}

export interface RefinePhaseInput {
	left: Millisecond;
	right: Millisecond;
	target: Degree;
}

export type LunarLongitudeDistanceTerm = readonly [number, number, number, number, number, number];
export type LunarLatitudeTerm = readonly [number, number, number, number, number];
