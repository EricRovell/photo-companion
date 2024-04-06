/**
 * reference: https://github.com/solidjs-community/solid-primitives/blob/main/packages/tween/src/index.ts
 */

import { createSignal, createEffect, onCleanup, on } from "solid-js";
import { isServer } from "solid-js/web";

export interface TweenProps {
	duration?: number;
	ease?: (t: number) => number;
}

type CreateTween = (target: () => number, options?: TweenProps) => () => number

const LINEAR: TweenProps["ease"] = t => t;

const DEFAULT_OPTIONS = {
	ease: LINEAR,
	duration: 100
};

/**
 * Creates a tween signal.
 * 
 */
export const createTween: CreateTween = (target, options = DEFAULT_OPTIONS) => {
	if (isServer) {
		return target;
	}

	const { ease = LINEAR, duration = 100 } = options;
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

	createEffect(
		on(
			target,
			() => {
				start = performance.now();
				startValue = value();
				delta = target() - startValue;
				frameId = requestAnimationFrame(tick);
				onCleanup(() => cancelAnimationFrame(frameId));
			},
			{
				defer: true
			}
		)
	);

	return value;
};
