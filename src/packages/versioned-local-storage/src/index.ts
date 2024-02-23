import { get, getVersion, set, remove, clear } from "./utils";
import { isNonNegativeInteger } from "@shared/utils";

export class Storage<T> {
	name: string;
	version: number;

	constructor(name: string, version?: number) {
		this.name = name;

		if (version) {
			if (!isNonNegativeInteger(version)) {
				throw new Error(`version should be a non-negative integer: ${version} was provided`);
			}

			this.version = version;

			const previousVersion = getVersion(name, 0);

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

	read(): T | null {
		const key = this.key;
		const storedValue = get(key);
		let value: T| null = null;

		if (storedValue) {
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
