import { isNonNegativeInteger, isNonNullable, isNullable } from "utils/validators";

import { clear, get, getVersion, remove, set } from "./utils";

const EMPTY_VERSION = 0;

interface StorageOptions {
	version?: number;
}

export class Storage<T> {
	name: string;
	version: number;

	get key() {
		return `${this.name}:${this.version}`;
	}

	constructor(name: string, options: StorageOptions = {}) {
		this.name = name;

		if (isNonNullable(options.version)) {
			if (!isNonNegativeInteger(options.version)) {
				throw new Error(`version should be a non-negative integer: ${options.version} was provided`);
			}

			this.version = options.version;
			const previousVersion = getVersion(name, EMPTY_VERSION);

			if (isNaN(previousVersion)) {
				throw new Error(`The previous version for ${name} is broken: ${previousVersion}`);
			}

			if (this.version > previousVersion) {
				remove(`${name}:${previousVersion}`);
				set(name, this.version.toString(10));
			}

			return;
		}

		const existingVersion = getVersion(name);

		if (isNaN(existingVersion)) {
			throw new Error(`There is not existing storage with name: ${name}`);
		}

		this.version = existingVersion;
	}

	static reset(): void {
		clear();
	}

	read(): Nullish<T> {
		const key = this.key;
		const storedValue = get(key);
		let value: Nullish<T> = null;

		if (!isNullable(storedValue)) {
			try {
				value = JSON.parse(storedValue);
			} catch {
				// purge the corrupted data
				remove(key);
			}
		}

		return value;
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
