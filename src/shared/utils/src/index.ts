export function padWithZero(number: number) {
	return number < 10 ? `0${number}` : number;
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
