import { isPositive } from "../src/utils";

import type { Sexagesimal } from "./types";

export function getDecimalValue (d: number, m: number, s: number): number {
	const positive = isPositive(d);
	const value = Math.abs(d) + Math.abs(m) / 60 + Math.abs(s) / 3600;
	return positive ? value : -1 * Math.abs(value);
}

export function getSexagesimalValue (decimalValue: number): Sexagesimal {
	const absValue = Math.abs(decimalValue);
	const degrees = Math.floor(absValue);
	const degreesFraction = absValue - degrees;
	const minutesFraction = degreesFraction * 60;
	const minutes = Math.floor(minutesFraction);
	const secondsFraction = (minutesFraction - minutes) * 60;
	const seconds = Math.floor(secondsFraction);
	const milliseconds = (secondsFraction - seconds) * 1000;
	return {
		milliseconds,
		minutes: minutes,
		radix: degrees,
		seconds: seconds,
		sign: isPositive(decimalValue) ? 1 : -1
	};
}

