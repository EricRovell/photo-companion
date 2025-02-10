/**
 * Checks if `value` is within the given `[ from, to ]` range.
 */
export function isWithinRange(value: unknown, from: number, to: number) {
	if (typeof value !== "number") {
		return false;
	}

	return value >= from && value <= to;
}

export function isInteger(value: unknown): value is number {
	return (
		typeof value === "number" &&
		Number.isInteger(value) &&
		value <= Number.MAX_SAFE_INTEGER &&
		value >= Number.MIN_SAFE_INTEGER
	);
}

export function isLatitude(value: number): boolean {
	return isWithinRange(value, -90, 90);
}

export function isLongitude(value: number): boolean {
	return isWithinRange(value, -180, 180);
}

export function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.length > 0;
}

export function isNonEmptyArray<T>(value: unknown): value is T[] {
	return Array.isArray(value) && value.length > 0;
}

export function isNonNegativeInteger(value: unknown): value is number {
	return isInteger(value) && value >= 0;
}

export function isNonNegativeNumber(value: unknown): value is number {
	return typeof value === "number" && value >= 0;
}

export function isNullable(value: unknown): value is null | undefined {
	return value === null || typeof value === "undefined";
}

export function isNonNullable<T = unknown>(value: T): value is T {
	return !isNullable(value);
}

export function isValidDate(value: Nullable<DateLike | string>): value is DateLike {
	if (value instanceof Date) {
		return value.toString() !== "Invalid Date";
	}

	if (typeof value === "number" || typeof value === "string") {
		return isValidDate(new Date(value));
	}

	return false;
}
