import { writable } from "svelte/store";

interface Options {
	callback?: () => void;
}

export function createTimer(timestamp: number, options: Options = {}) {
	const { callback } = options;
	const time = timestamp - Date.now();
	const { set, subscribe, update } = writable<number>(time);

	let intervalId: Undefinable<number> = undefined;

	function start() {
		clearInterval(intervalId);

		intervalId = window.setInterval(() => {
			update(value => value - 1000);
		}, 1000);
	}

	function stop() {
		clearInterval(intervalId);
		intervalId = undefined;
	}

	function updateTime(timestamp: number) {
		const time = timestamp - Date.now();

		if (time > 0) {
			set(time);
			start();
		} else {
			stop();
		}
	}

	subscribe(value => {
		if (value <= 0) {
			stop();
			callback?.();
		}
	});

	return {
		subscribe,
		start,
		stop,
		set: updateTime
	};
}

