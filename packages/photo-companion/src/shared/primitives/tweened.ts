/**
 * reference: https://github.com/solidjs-community/solid-primitives/blob/main/packages/tween/src/index.ts
 */

import { createEffect, createMemo, createSignal, on, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { cubicInOut, type EasingFn } from "utils/easing";

import type { Accessor} from "solid-js";

export interface TweenedProps {
	duration?: number;
	ease?: EasingFn;
	interpolate?: InterpolateFn;
	map?: (value: number) => number;
}

export type InterpolateFn = (from: number, to: number, progress: number) => number;

type CreateTweened = (target: Accessor<number>, options?: TweenedProps) => Accessor<number>

export const linear: InterpolateFn = (from, to, progress) => (
	from + (to - from) * progress
);

const identity = (value: number) => value;

export function circular(period: number): InterpolateFn {
	if (period <= 0) {
		throw new RangeError("Circular interpolation requires a positive period.");
	}

	return (from, to, progress) => {
		let delta = (to - from) % period;

		if (delta > period / 2) {
			delta -= period;
		} else if (delta < -period / 2) {
			delta += period;
		}

		return from + delta * progress;
	};
}

const DEFAULT_OPTIONS = {
	duration: 400,
	ease: cubicInOut,
	interpolate: linear,
	map: identity
};

/**
 * Creates a tween signal.
 *
 */
export const createTweened: CreateTweened = (target, options = DEFAULT_OPTIONS) => {
	const {
		duration = DEFAULT_OPTIONS.duration,
		ease = DEFAULT_OPTIONS.ease,
		interpolate = DEFAULT_OPTIONS.interpolate,
		map = DEFAULT_OPTIONS.map
	} = options;

	if (isServer) {
		return () => map(target());
	}

	const [ value, setValue ] = createSignal(target());

	let endValue: number;
	let frameId: number;
	let start: number;
	let startValue: number;

	function tick(t: number) {
		const elapsed = t - start;

		if (elapsed < duration) {
			setValue(interpolate(startValue, endValue, ease(elapsed / duration)));
			frameId = requestAnimationFrame(tick);
		} else {
			setValue(interpolate(startValue, endValue, 1));
		}
	}

	createEffect(on(target, (targetValue) => {
		endValue = targetValue;
		start = performance.now();
		startValue = value();
		frameId = requestAnimationFrame(tick);

		onCleanup(() => {
			cancelAnimationFrame(frameId);
		});
	}, { defer: true }));

	const mappedValue = createMemo(() => map(value()));

	return mappedValue;
};
