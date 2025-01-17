/**
 * reference: https://github.com/solidjs-community/solid-primitives/blob/main/packages/tween/src/index.ts
 */

import { createEffect, createSignal, on, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { cubicInOut, type EasingFn } from "utils/easing";

import type { Accessor} from "solid-js";

export interface TweenedProps {
	duration?: number;
	ease?: EasingFn;
}

type CreateTweened = (target: Accessor<number>, options?: TweenedProps) => Accessor<number>

const DEFAULT_OPTIONS = {
	duration: 400,
	ease: cubicInOut
};

/**
 * Creates a tween signal.
 *
 */
export const createTweened: CreateTweened = (target, options = DEFAULT_OPTIONS) => {
	if (isServer) {
		return target;
	}

	const { duration = 100, ease = cubicInOut } = options;
	const [ value, setValue ] = createSignal(target());

	let start: number;
	let startValue: number;
	let delta: number;
	let frameId: number;

	function tick(t: number) {
		const elapsed = t - start;

		if (elapsed < duration) {
			setValue(startValue + ease(elapsed / duration) * delta);
			frameId = requestAnimationFrame(tick);
		} else {
			setValue(target());
		}
	}

	createEffect(on(target, () => {
		start = performance.now();
		startValue = value();
		delta = target() - startValue;
		frameId = requestAnimationFrame(tick);

		onCleanup(() => {
			cancelAnimationFrame(frameId);
		});
	}, { defer: true }));

	return value;
};
