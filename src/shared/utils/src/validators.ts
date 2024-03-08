export function isInteger(value: unknown): value is number {
	return !Number.isNaN(value) && Number.isInteger(value);
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

export function isValidDate(date: Date | number | string | undefined): boolean {
	if (date instanceof Date) {
		return !isNaN(date.getTime());
	}

	if (typeof date === "number" || typeof date === "string") {
		return isValidDate(new Date(date));
	}

	return false;
}
