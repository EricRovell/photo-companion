import { get as getStoreValue, writable } from "svelte/store";

/**
 * Local storage based persistable store.
 */
export function persistable<T>(key: string, defaultValue: T = {} as T) {
	const store = writable<T>();
	const { set, subscribe } = store;

	function get() {
		return {
			...getStoreValue(store)
		};
	}

	function getItem(key: keyof T) {
		return get()[key];
	}

	function init() {
		const stored = window.localStorage.getItem(key);

		const value: T = stored
			? { ...defaultValue, ...JSON.parse(stored) }
			: { ...defaultValue };

		set(value);
		return value;
	}

	function persist(value?: T) {
		const current = value ?? get();
		window.localStorage.setItem(key, JSON.stringify(current));
	}

	function purge() {
		window.localStorage.removeItem(key);
	}

	function reset() {
		set(defaultValue);
		persist();
	}

	store.subscribe(value => {
		if (value && Object.keys(value).length) {
			persist(value);
		}
	});

	return {
		get,
		getItem,
		init,
		persist,
		purge,
		reset,
		subscribe
	};
}
