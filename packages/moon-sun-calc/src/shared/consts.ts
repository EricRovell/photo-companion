import type {
	Celsius,
	Hectopascal,
	JulianDay,
	Meter,
	Millisecond
} from "../types";

export const ABSOLUTE_ZERO_CELSIUS: Celsius = -273.15;
export const DAY_MS: Millisecond = 86_400_000;
export const DEFAULT_ATMOSPHERIC_PRESSURE: Hectopascal = 1010;
export const DEFAULT_ATMOSPHERIC_TEMPERATURE: Celsius = 10;
export const DEFAULT_EVENT_STEP: Millisecond = 5 * 60 * 1000;
export const DEFAULT_OBSERVER_ELEVATION: Meter = 0;
export const DEG_TO_RAD = Math.PI / 180;
export const J2000: JulianDay = 2_451_545;
export const MAX_EVENT_STEP: Millisecond = 3_600_000;
export const MAX_OBSERVER_ELEVATION: Meter = 100_000;
export const MAX_SUPPORTED_YEAR = 2200;
export const MIN_EVENT_STEP: Millisecond = 10_000;
export const MIN_OBSERVER_ELEVATION: Meter = -500;
export const MIN_SUPPORTED_YEAR = 1800;
export const RAD_TO_DEG = 180 / Math.PI;
export const UNIX_EPOCH_JD: JulianDay = 2_440_587.5;
