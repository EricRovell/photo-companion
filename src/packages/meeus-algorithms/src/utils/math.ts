import type { Degree, Hour } from "../types";

export function fmod(a: number, b: number): number {
	return Number(a - Math.floor(a / b) * b);
}

export function fmod24(hours: Hour): Hour {
	return fmod(hours, 24);
}

export function fmod360(degrees: Degree): Degree {
	return fmod(degrees, 360);
}

export function fmod180(degrees: Degree): Degree {
	let result = fmod360(degrees);

	if (result > 180) {
		result -= 360;
	} else if (result < -180) {
		result += 360;
	}

	return result;
}

export function fmod90(degrees: Degree): Degree {
	let result = fmod360(degrees);

	if (result > 270) {
		result -= 360;
	} else if (result > 180) {
		result = 180 - result;
	} else if (result > 90) {
		result = 180 - result;
	}

	return result;
}
