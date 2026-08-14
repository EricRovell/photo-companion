import { isNullable } from "utils/validators";

import {
	ABSOLUTE_ZERO_CELSIUS,
	DAY_MS,
	DEFAULT_ATMOSPHERIC_PRESSURE,
	DEFAULT_ATMOSPHERIC_TEMPERATURE,
	DEFAULT_EVENT_STEP,
	DEFAULT_OBSERVER_ELEVATION,
	MAX_EVENT_STEP,
	MAX_OBSERVER_ELEVATION,
	MAX_SUPPORTED_YEAR,
	MIN_EVENT_STEP,
	MIN_OBSERVER_ELEVATION,
	MIN_SUPPORTED_YEAR
} from "./consts";

import type {
	Atmosphere,
	DateLike,
	Degree,
	EventOptions,
	Millisecond,
	Observer,
	UtcInterval
} from "../types";
import type { IntegerRangeValidationInput, ValidatedInterval } from "./types";

function isWithinRange(value: unknown, minimum: number, maximum: number): value is number {
	return typeof value === "number" && value >= minimum && value <= maximum;
}

function isInteger(value: unknown): value is number {
	return Number.isSafeInteger(value);
}

function isLatitude(value: unknown): value is Degree {
	return isWithinRange(value, -90, 90);
}

function isLongitude(value: unknown): value is Degree {
	return isWithinRange(value, -180, 180);
}

export function toTimestamp(input: DateLike, label = "instant"): Millisecond {
	const timestamp = input instanceof Date ? input.getTime() : input;

	if (!Number.isFinite(timestamp)) {
		throw new RangeError(`${label} must be a valid Date or finite millisecond timestamp`);
	}

	const year = new Date(timestamp).getUTCFullYear();

	if (!isWithinRange(year, MIN_SUPPORTED_YEAR, MAX_SUPPORTED_YEAR)) {
		throw new RangeError(`${label} must be between ${MIN_SUPPORTED_YEAR}-01-01 and ${MAX_SUPPORTED_YEAR}-12-31 UTC`);
	}

	return timestamp;
}

export function validateAltitude(altitude: Degree): Degree {
	if (!isLatitude(altitude)) {
		throw new RangeError("Altitude must be a finite number from -90 to 90 degrees");
	}

	return altitude;
}

export function validateAtmosphere(atmosphere: Atmosphere = {}): Required<Atmosphere> {
	const pressure = isNullable(atmosphere.pressure)
		? DEFAULT_ATMOSPHERIC_PRESSURE
		: atmosphere.pressure;
	const temperature = isNullable(atmosphere.temperature)
		? DEFAULT_ATMOSPHERIC_TEMPERATURE
		: atmosphere.temperature;

	if (
		!Number.isFinite(pressure)
		|| pressure <= 0
		|| !Number.isFinite(temperature)
		|| temperature <= ABSOLUTE_ZERO_CELSIUS
	) {
		throw new RangeError("atmosphere must contain positive pressure and a temperature above absolute zero");
	}

	return { pressure, temperature };
}

export function validateAzimuth(azimuth: Degree): Degree {
	if (!isWithinRange(azimuth, 0, 360) || azimuth === 360) {
		throw new RangeError("Azimuth must be a finite number from 0 (inclusive) to 360 (exclusive) degrees");
	}

	return azimuth;
}

export function validateEventStep(options: EventOptions): Millisecond {
	const step = isNullable(options.step) ? DEFAULT_EVENT_STEP : options.step;

	if (!isWithinRange(step, MIN_EVENT_STEP, MAX_EVENT_STEP)) {
		throw new RangeError(`options.step must be from ${MIN_EVENT_STEP} to ${MAX_EVENT_STEP} milliseconds`);
	}

	return step;
}

export function validateFiniteDegrees(values: readonly Degree[]): void {
	if (!values.every(Number.isFinite)) {
		throw new RangeError("Angles must be finite degree values");
	}
}

export function validateIntegerRange({
	label,
	maximum,
	minimum,
	value
}: IntegerRangeValidationInput): number {
	if (!isInteger(value) || !isWithinRange(value, minimum, maximum)) {
		throw new RangeError(`${label} must be an integer from ${minimum} to ${maximum}`);
	}

	return value;
}

export function validateInterval(interval: UtcInterval): ValidatedInterval {
	const start = toTimestamp(interval.start, "interval.start");
	const end = toTimestamp(interval.end, "interval.end");

	if (end <= start) {
		throw new RangeError("interval.end must be later than interval.start");
	}

	if (end - start > 2 * DAY_MS) {
		throw new RangeError("interval must not be longer than 48 hours");
	}

	return { end, start };
}

export function validateObserver(observer: Observer): Required<Observer> {
	if (!isLatitude(observer.latitude)) {
		throw new RangeError("observer.latitude must be a finite number from -90 to 90 degrees");
	}

	if (!isLongitude(observer.longitude)) {
		throw new RangeError("observer.longitude must be a finite number from -180 to 180 degrees");
	}

	const elevation = isNullable(observer.elevation)
		? DEFAULT_OBSERVER_ELEVATION
		: observer.elevation;

	if (!isWithinRange(elevation, MIN_OBSERVER_ELEVATION, MAX_OBSERVER_ELEVATION)) {
		throw new RangeError(`observer.elevation must be a finite number from ${MIN_OBSERVER_ELEVATION} to ${MAX_OBSERVER_ELEVATION} meters`);
	}

	return { ...observer, elevation };
}
