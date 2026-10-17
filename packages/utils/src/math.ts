/**
 * Restricts a number to the inclusive [ min, max ] range.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Normalizes an angle in degrees to the [ 0, 360 ) range.
 */
export function normalizeDegrees(value: number): number {
	return ((value % 360) + 360) % 360;
}

/**
 * Converts clockwise degrees with north at 0° into Cartesian coordinates.
 */
export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;

	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians)
	};
}

/**
 * Round the number up to the desired precision.
 */
export function round(number: number, digits = 0, base = Math.pow(10, digits)): number {
	return Math.round(number * base) / base + 0;
}

/**
 * Scales the value from a given [ inLow, inHigh ] range to [ outLow, outHight ].
 */
export function scale(value: number, inLow: number, inHigh: number, outLow: number, outHigh: number): number {
	if ([ value, inLow, inHigh, outLow, outHigh ].some(isNaN)) {
		return NaN;
	}

	if (value === Infinity || value === -Infinity) {
		return value;
	}

	return (value - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
}

export type Degrees = [ degrees: number, minutes: number, seconds: number ];

export function convertIntoDegrees(value: number): Degrees {
	if (Number.isNaN(value)) {
		return [ 0, 0, 0 ];
	}

	const degrees = Math.trunc(value);
	const frac = (value - degrees) * 60;
	const minutes = Math.trunc(frac);
	const seconds = Math.trunc((frac - minutes) * 60);

	return [ degrees, minutes, seconds ];
}

export function convertDegreesIntoDecimal(values: Degrees): number {
	const [ degrees = 0, minutes = 0, seconds = 0 ] = values;

	if ([ degrees, minutes, seconds ].some(Number.isNaN)) {
		return 0;
	}

	return degrees + minutes / 60 + seconds / 3600;
}
