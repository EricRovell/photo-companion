import { writable } from "svelte/store";
import { Storage } from "versioned-local-storage";

/**
 * Versioned Local Storage based persistable store.
 */
export function persistable<T>(name: string, version: number, defaultValue: T) {
	const store = writable<T>();
	const { set, subscribe } = store;
	let storage: Storage<T>;

	function init(): T {
		storage = new Storage<T>(name, version);
		const value = storage.read() ?? defaultValue;
		set(value);

		return value;
	}

	function persist(value: T) {
		storage.write(value);
	}

	function read(): Nullish<T> {
		return storage.read();
	}

	function reset() {
		set(defaultValue);
		persist(defaultValue);
	}

	store.subscribe(value => {
		if (value && Object.keys(value).length) {
			persist(value);
		}
	});

	return {
		init,
		persist,
		read,
		reset,
		set,
		subscribe
	};
}
