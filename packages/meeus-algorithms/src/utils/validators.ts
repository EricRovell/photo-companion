export function isGregorian(year: number): boolean {
	return year >= 1582;
}

export function isNumber(input: unknown): input is number {
	return typeof input === "number";
}

export function isPositive (input: unknown): boolean {
	return isNumber(input) && input >= 0;
}

export function isNegative (input: unknown): boolean {
	return isNumber(input) && input < 0;
}
