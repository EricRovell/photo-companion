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
