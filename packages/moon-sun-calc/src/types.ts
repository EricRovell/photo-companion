export type Celsius = number;
export type Degree = number;
export type Fraction = number;
export type Hectopascal = number;
export type JulianDay = number;
export type Kilometer = number;
export type Meter = number;
export type Millisecond = number;
export type Radian = number;

export type DateLike = Date | Millisecond;

export interface Observer {
	/** Height above the local horizon datum. */
	elevation?: Meter;
	/** Geodetic latitude, north-positive. */
	latitude: Degree;
	/** Geodetic longitude, east-positive. */
	longitude: Degree;
}

export interface UtcInterval {
	/** Exclusive UTC instant. */
	end: DateLike;
	/** Inclusive UTC instant. */
	start: DateLike;
}

export interface Atmosphere {
	pressure?: Hectopascal;
	temperature?: Celsius;
}

export interface PositionOptions {
	atmosphere?: Atmosphere;
}

export interface EventOptions extends PositionOptions {
	/** Maximum interval length is 48 hours. */
	step?: Millisecond;
}
