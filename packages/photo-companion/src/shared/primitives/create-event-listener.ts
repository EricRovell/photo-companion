import { createEffect, createSignal, getOwner, on, onCleanup } from "solid-js";
import { isNullable } from "utils/validators";

import type { Accessor} from "solid-js";

type MaybeAccessor<T> = Accessor<T> | T;

export function isAccessor<T>(val?: unknown): val is Accessor<T> {
	return typeof val === "function";
}

/**
 * Normalizes a value into Accessor.
 */
export function toAccessor<T>(input: Accessor<Nullable<T>> | Nullable<T>): Accessor<Nullable<T>> {
	if (isNullable(input) || !isAccessor(input)) {
		const [ getter ] = createSignal(input);
		return getter;
	}

	return input;
}

/**
 * Calls `onCleanup()` if it is inside a component lifecycle, if not, do nothing.
 */
export function tryOnCleanup(func: VoidFn) {
	if (getOwner()) {
		onCleanup(func);
		return true;
	}

	return false;
}

type Input<E> = E extends keyof HTMLElementEventMap
	? {
		event: E;
		listener: (this: Window, event: HTMLElementEventMap[E]) => void;
		options?: AddEventListenerOptions;
		target: MaybeAccessor<Nullable<HTMLElement>>;
	}
	: E extends keyof WindowEventMap
		? {
			event: E;
			listener: (this: Window, event: WindowEventMap[E]) => void;
			options?: AddEventListenerOptions;
			target: Window;
		}
		: E extends keyof DocumentEventMap
			? {
				event: E;
				listener: (this: Window, event: DocumentEventMap[E]) => void;
				options?: AddEventListenerOptions;
				target: Document;
			}
			: never;

/**
 * Registers using `addEventListener` on mounted, and `removeEventListener` automatically on unmounted.
 */
export function createEventListener<E>(input: Input<E>): VoidFn {
	const {
		event,
		listener,
		options,
		target = globalThis.window
	} = input;

	const cleanupList: VoidFn[] = [];

	const cleanup = () => {
		cleanupList.forEach(fn => fn());
		cleanupList.length = 0;
	};

	const register = ({ event, listener, options, target }: {
		event: E,
		listener: Input<E>["listener"],
		options: Input<E>["options"],
		target: Document | HTMLElement | Window;
	}) => {
		// @ts-expect-error: TODO type check
		target.addEventListener(event, listener, options);
		// @ts-expect-error: TODO type check
		return () => target.removeEventListener(event, listener, options);
	};

	createEffect(on(toAccessor(target), (target) => {
		cleanup();

		if (!target) {
			return;
		}

		cleanupList.push(
			register({ event, listener, options, target })
		);
	}));

	tryOnCleanup(cleanup);

	return cleanup;
}
