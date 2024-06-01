import { isNonNegativeInteger, isNullable } from "utils/validators";

const LOCAL_STORAGE_ERROR = "localStorage is not accessible";

export function get(key: string): Nullish<string> {
	let value = null;

	try {
		value = globalThis.localStorage.getItem(key);
	} catch (error) {
		throw new Error(LOCAL_STORAGE_ERROR);
	}

	return value;
}

export function set(key: string, value: string): void {
	try {
		globalThis.localStorage.setItem(key, value);
	} catch (error) {
		throw new Error(LOCAL_STORAGE_ERROR);
	}
}

export function remove(key: string): void {
	try {
		globalThis.localStorage.removeItem(key);
	} catch (error) {
		throw new Error(LOCAL_STORAGE_ERROR);
	}
}

export function clear(): void {
	try {
		globalThis.localStorage.clear();
	} catch (error) {
		throw new Error(LOCAL_STORAGE_ERROR);
	}
}

export function getVersion(name: string, defaultVersion?: number): number {
	const storedVersion = get(name);

	if (!isNullable(storedVersion)) {
		return parseInt(storedVersion, 10);
	}

	if (isNonNegativeInteger(defaultVersion)) {
		return defaultVersion;
	}

	return NaN;
}
