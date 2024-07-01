import { isNonNegativeInteger, isNonNullable, isNullable } from "utils/validators";

import { clear, get, getVersion, remove, set } from "./utils";

const EMPTY_VERSION = 0;

export class Storage<T> {
	name: string;
	version: number;

	constructor(name: string, version?: number) {
		this.name = name;

		if (isNonNullable(version)) {
			if (!isNonNegativeInteger(version)) {
				throw new Error(`version should be a non-negative integer: ${version} was provided`);
			}

			this.version = version;
			const previousVersion = getVersion(name, EMPTY_VERSION);

			if (isNaN(previousVersion)) {
				throw new Error(`The previous version for ${name} is broken: ${previousVersion}`);
			}

			if (version > previousVersion) {
				remove(`${name}:${previousVersion}`);
				set(name, version.toString(10));
			}

			return;
		}

		const existingVersion = getVersion(name);

		if (isNaN(existingVersion)) {
			throw new Error(`There is not existing storage with name: ${name}`);
		}

		this.version = existingVersion;
	}

	get key() {
		return `${this.name}:${this.version}`;
	}

	read(): Nullish<T> {
		const key = this.key;
		const storedValue = get(key);
		let value: Nullish<T> = null;

		if (!isNullable(storedValue)) {
			try {
				value = JSON.parse(storedValue);
			} catch (error) {
				// purge the corrupted data
				remove(key);
			}
		}

		return value;
	}

	static reset(): void {
		clear();
	}

	write(value: T): void {
		const key = this.key;
		const valueString = JSON.stringify(value);

		if (!valueString) {
			remove(key);
		} else {
			set(key, valueString);
		}
	}
}
