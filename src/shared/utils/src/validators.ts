export function isInteger(value: unknown): value is number {
	return !Number.isNaN(value) && Number.isInteger(value);
}
