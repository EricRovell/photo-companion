import { createEffect, on } from "solid-js";
import { isNullable } from "utils/validators";

import type { Accessor} from "solid-js";

import { toAccessor, tryOnCleanup } from "../helpers";

export type MaybeElement = Nullable<HTMLElement | SVGElement>;
export type MaybeElementAccessor<T extends MaybeElement = MaybeElement> = Accessor<T>;

export function createResizeObserver(target: MaybeElementAccessor, callback: ResizeObserverCallback) {
	let observer: Undefinable<ResizeObserver> = undefined;

	const cleanup = () => {
		if (!isNullable(observer)) {
			observer.disconnect();
			observer = undefined;
		}
	};

	createEffect(on(toAccessor(target), (target) => {
		cleanup();

		if (isNullable(globalThis.window) || isNullable(target)) {
			return;
		}

		observer = new ResizeObserver(callback);
		observer.observe(target);
	}));

	tryOnCleanup(cleanup);
}
