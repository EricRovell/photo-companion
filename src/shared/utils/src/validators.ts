export function isInteger(value: unknown): value is number {
	return (
		typeof value === "number" &&
		Number.isInteger(value) &&
		value <= Number.MAX_SAFE_INTEGER &&
		value >= Number.MIN_SAFE_INTEGER
	);
}

export function isLatitude(value: number): boolean {
	return value >= -90 && value <= 90;
}

export function isLongitude(value: number): boolean {
	return value >= -180 && value <= 180;
}

export function isNonNegativeInteger(value: unknown): value is number {
	return isInteger(value) && value >= 0;
}

export function isNullable(value: unknown): value is null | undefined {
	return value === null || typeof value === "undefined";
}

export function isNonNullable(value: unknown): boolean {
	return !isNullable(value);
}

export function isValidDate(value: Date | number | string | undefined | null): value is Date | number {
	if (value instanceof Date) {
		return !isNaN(value.getTime());
	}

	if (typeof value === "number" || typeof value === "string") {
		return isValidDate(new Date(value));
	}

	return false;
}
