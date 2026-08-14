import type {
	Atmosphere,
	Degree,
	Kilometer,
	Millisecond,
	Observer
} from "../types";

export interface EquatorialCoordinates {
	declination: Degree;
	rightAscension: Degree;
}

export interface GeocentricCoordinates extends EquatorialCoordinates {
	distance: Kilometer;
	eclipticLatitude: Degree;
	eclipticLongitude: Degree;
}

export interface HorizontalCoordinates extends EquatorialCoordinates {
	altitude: Degree;
	apparentAltitude: Degree;
	azimuth: Degree;
	hourAngle: Degree;
	parallacticAngle: Degree;
}

export interface Nutation {
	longitude: Degree;
	obliquity: Degree;
}

export interface EclipticToEquatorialInput {
	latitude: Degree;
	longitude: Degree;
	obliquity: Degree;
}

export interface HorizontalCoordinatesInput {
	atmosphere?: Atmosphere;
	coordinates: EquatorialCoordinates;
	distance?: Kilometer;
	observer: Required<Observer>;
	timestamp: Millisecond;
}

export interface ClampInput {
	maximum: number;
	minimum: number;
	value: number;
}

export interface IntegerRangeValidationInput {
	label: string;
	maximum: number;
	minimum: number;
	value: unknown;
}

export type RootFunction = (time: Millisecond) => number;
export type RootContinuityCheck = (left: number, right: number) => boolean;

export interface RefineRootInput {
	fn: RootFunction;
	left: Millisecond;
	right: Millisecond;
}

export interface RootSearchInput {
	end: Millisecond;
	fn: RootFunction;
	isContinuous?: RootContinuityCheck;
	start: Millisecond;
	step: Millisecond;
}

export interface MeridianCrossing {
	kind: "anti" | "transit";
	time: Millisecond;
}

export interface MeridianCrossingsInput {
	end: Millisecond;
	hourAngle: (time: Millisecond) => Degree;
	start: Millisecond;
	step: Millisecond;
}

export interface ValidatedInterval {
	end: Millisecond;
	start: Millisecond;
}
