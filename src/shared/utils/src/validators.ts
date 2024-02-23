export function isInteger(value: unknown): value is number {
	return !Number.isNaN(value) && Number.isInteger(value);
}

export function isNonNegativeInteger(value: unknown): value is number {
	return isInteger(value) && value >= 0;
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

export function isNullable(value: unknown): boolean {
	return value === null || typeof value === "undefined";
}

export function isNonNullable(value: unknown): boolean {
	return !isNullable(value);
}
