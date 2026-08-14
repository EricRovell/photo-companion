import { DEG_TO_RAD, RAD_TO_DEG } from "./consts";

import type { Degree, Radian } from "../types";
import type { ClampInput } from "./types";

export function toRadians(value: Degree): Radian {
	return value * DEG_TO_RAD;
}

export function toDegrees(value: Radian): Degree {
	return value * RAD_TO_DEG;
}

export function normalizeDegrees(value: Degree): Degree {
	return ((value % 360) + 360) % 360;
}

export function normalizeSignedDegrees(value: Degree): Degree {
	const normalized = normalizeDegrees(value);
	return normalized > 180 ? normalized - 360 : normalized;
}

export function clamp({ maximum, minimum, value }: ClampInput): number {
	return Math.min(maximum, Math.max(minimum, value));
}

export function angularDifference(left: Degree, right: Degree): Degree {
	return normalizeSignedDegrees(left - right);
}
