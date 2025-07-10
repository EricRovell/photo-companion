import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import type { Degree, Hour } from "./types";

dayjs.extend(utc);

export function isNumber (input: unknown): input is number {
	return typeof input === "number";
}

export function isPositive (input: unknown): boolean {
	return isNumber(input) && input >= 0;
}

export function fmod (a: number, b: number): number {
	return Number(a - (Math.floor(a / b) * b));//.toPrecision(8))
}

export function fmod24 (hours: Hour): Hour {
	return fmod(hours, 24);
}

export function fmod360 (degrees: Degree): Degree {
	return fmod(degrees, 360);
}

export function fmod180 (degrees: Degree): Degree {
	let result = fmod360(degrees);

	if (result > 180) {
		result = result - 360;
	} else if (result < -180) {
		result = result + 360;
	}

	return result;
}

export function fmod90 (degrees: Degree): Degree {
	let result = fmod360(degrees);

	if (result > 270) {
		result = result - 360;
	} else if (result > 180) {
		result = 180 - result;
	} else if (result > 90) {
		result = 180 - result;
	}

	return result;
}
