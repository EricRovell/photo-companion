export function padWithZero(number: number): string {
	return number < 10 ? `0${number}` : number.toString();
}

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Same as `Object.entries()` but with type inference
 */
export function objectEntries<T extends object>(obj: T): Entries<T> {
	return Object.entries(obj) as Entries<T>;
}
